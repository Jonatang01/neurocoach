import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

// Configurar Google Gemini con API key
const google_ai = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// Clerk y Google Calendar son opcionales - modo demo si no están configurados
let auth: any = null;
let clerkClient: any = null;
let google: any = null;

try {
  const clerk = require("@clerk/nextjs/server");
  auth = clerk.auth;
  clerkClient = clerk.clerkClient;
  const googleapis = require("googleapis");
  google = googleapis.google;
} catch {
  console.log("[NeuroCoach] Modo demo: Clerk/Google Calendar no configurados");
}

// RAG: Leemos knowledge.txt al inicio del módulo (server-side only)
let knowledgeBase = "";
try {
  knowledgeBase = readFileSync(join(process.cwd(), "knowledge.txt"), "utf-8");
} catch {
  console.warn(
    "⚠️ knowledge.txt no encontrado, continuando sin base de conocimiento"
  );
}

const SYSTEM_PROMPT = `Eres NeuroCoach 🧠, un coach de hábitos inteligente basado estrictamente en ciencia conductual.

## TU PERSONALIDAD
- Eres motivador, empático, pero siempre científico
- Hablas en español, de forma cercana pero profesional
- Usas emojis con moderación para ser más expresivo
- Celebras cada pequeño logro del usuario (libera dopamina)
- Eres conciso: respuestas claras de 2-4 oraciones máximo, salvo que el usuario pida más detalle

## TU BASE DE CONOCIMIENTO CIENTÍFICA
${knowledgeBase}

## REGLAS DE COMPORTAMIENTO
1. SIEMPRE fundamenta tus consejos en la ciencia conductual (James Clear, BJ Fogg, Charles Duhigg)
2. Aplica la "Regla de los 2 minutos": sugiere versiones diminutas de hábitos nuevos
3. Usa el modelo B=MAP cuando analices por qué un hábito falla
4. Promueve cambios de identidad ("Soy una persona que...") sobre metas numéricas
5. Cuando el usuario quiera agendar algo (entrenamientos, recordatorios, compromisos), USA la herramienta crearEvento
6. Cuando el usuario se comprometa formalmente a iniciar un nuevo hábito, o diga "me comprometo", "quiero empezar", "voy a hacer X después de Y", NO respondas solo con texto. Usa OBLIGATORIAMENTE la herramienta 'solicitarContrato' para generar el documento visual de compromiso.
7. Para usar solicitarContrato, necesitas identificar el hábito (lo que quiere hacer) y el ancla (la rutina previa existente a la que se ancla). Si el usuario no menciona un ancla, pregúntale: "¿A qué rutina que ya hagas todos los días te gustaría anclar este hábito?"
8. NUNCA inventes datos científicos, solo usa lo que está en tu base de conocimiento
9. Si el usuario te saluda, preséntate brevemente y pregunta en qué hábito quiere trabajar

## HERRAMIENTAS
- crearEvento: Usa esta herramienta cuando el usuario quiera agendar, programar, o recordar algo. Interpreta fechas relativas como "mañana", "el lunes", etc. El evento se creará en Google Calendar del usuario.
- solicitarContrato: Usa esta herramienta cuando el usuario se comprometa a un nuevo hábito. Genera un Contrato de Identidad visual basado en el modelo "Después de [ancla], haré [hábito]" de Tiny Habits (BJ Fogg). SIEMPRE identifica el ancla y el hábito antes de invocarla.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Obtener auth de Clerk (null si no está configurado)
  let userId: string | null = null;
  if (auth) {
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch {
      console.log("[NeuroCoach] Clerk no configurado, usando modo demo");
    }
  }

  // Convertir UIMessages (con parts) a ModelMessages (con content)
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    // Google Gemini - conexion directa con API key
    model: google_ai("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    tools: {
      crearEvento: {
        description:
          "Crea un evento REAL en Google Calendar del usuario. Usa esta herramienta cuando el usuario quiera agendar, programar, o crear un recordatorio para algo.",
        parameters: z.object({
          titulo: z
            .string()
            .describe(
              "Nombre descriptivo del evento (ej: 'Fútbol con amigos')"
            ),
          fechaHoraInicio: z
            .string()
            .describe(
              "Fecha y hora de inicio en formato ISO 8601 (ej: '2025-04-25T17:00:00')"
            ),
          duracionMinutos: z
            .number()
            .describe("Duración del evento en minutos (ej: 60 para 1 hora)"),
        }),
        execute: async ({ titulo, fechaHoraInicio, duracionMinutos }) => {
          // MODO DEMO: Si Clerk no está configurado, devolver evento simulado
          if (!clerkClient || !google || !userId) {
            return {
              success: true,
              demo: true,
              titulo,
              fechaHoraInicio,
              duracionMinutos,
              link: "",
              message: "Modo demo: El evento se mostraria aqui (configura Clerk para crear eventos reales)",
            };
          }

          try {
            // Obtener el token de Google OAuth del usuario via Clerk
            const clerk = await clerkClient();
            const tokenResponse = await clerk.users.getUserOauthAccessToken(
              userId,
              "google"
            );

            const googleToken = tokenResponse.data[0]?.token;

            if (!googleToken) {
              return {
                success: false,
                error: "No se encontró conexión con Google Calendar. Por favor vincula tu cuenta de Google.",
                titulo,
              };
            }

            // Configurar cliente de Google Calendar
            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: googleToken });

            const calendar = google.calendar({
              version: "v3",
              auth: oauth2Client,
            });

            // Calcular fecha de fin
            const startDate = new Date(fechaHoraInicio);
            const endDate = new Date(
              startDate.getTime() + duracionMinutos * 60 * 1000
            );

            // Crear el evento en Google Calendar
            const event = await calendar.events.insert({
              calendarId: "primary",
              requestBody: {
                summary: titulo,
                start: {
                  dateTime: startDate.toISOString(),
                  timeZone: "America/Mexico_City",
                },
                end: {
                  dateTime: endDate.toISOString(),
                  timeZone: "America/Mexico_City",
                },
                reminders: {
                  useDefault: false,
                  overrides: [
                    { method: "popup", minutes: 30 },
                    { method: "email", minutes: 60 },
                  ],
                },
              },
            });

            return {
              success: true,
              titulo,
              link: event.data.htmlLink || "",
              eventId: event.data.id,
              fechaHoraInicio,
              duracionMinutos,
            };
          } catch (error) {
            console.error("Error creando evento en Google Calendar:", error);
            return {
              success: false,
              error: "Error al crear el evento en Google Calendar",
              titulo,
            };
          }
        },
      },

      solicitarContrato: {
        description:
          "Genera un Contrato de Identidad visual para que el usuario formalice su compromiso con un nuevo hábito. Basado en el modelo Tiny Habits de BJ Fogg: 'Después de [ancla], haré [hábito]'. Usa esta herramienta cuando el usuario se comprometa a iniciar un nuevo hábito.",
        parameters: z.object({
          habito: z
            .string()
            .describe(
              "El nuevo hábito que el usuario quiere adoptar, en su versión más simple/diminuta (ej: 'hacer 2 flexiones', 'meditar 2 minutos', 'leer 1 página')"
            ),
          ancla: z
            .string()
            .describe(
              "La rutina existente del usuario a la que se ancla el nuevo hábito (ej: 'lavarme los dientes', 'servirme el café', 'sentarme en mi escritorio')"
            ),
        }),
        execute: async ({ habito, ancla }) => {
          return {
            habito,
            ancla,
            estado: "pendiente_firma",
            modelo: "Tiny Habits (BJ Fogg)",
            creadoEn: new Date().toISOString(),
          };
        },
      },
    },
    maxSteps: 3,
    onError({ error }) {
      console.error("NeuroCoach stream error:", error);
    },
  });

  return result.toUIMessageStreamResponse();
}
