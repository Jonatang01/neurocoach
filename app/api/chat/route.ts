import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const customGoogle = createGoogleGenerativeAI({
  // Vercel AI Gateway URL si existe, sino fallback a Google normal
  baseURL: process.env.AI_GATEWAY_URL || "https://generativelanguage.googleapis.com/v1beta",
});
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

// RAG: Leemos knowledge.txt al inicio del módulo (server-side only)
let knowledgeBase = "";
try {
  knowledgeBase = readFileSync(
    join(process.cwd(), "knowledge.txt"),
    "utf-8"
  );
} catch {
  console.warn("⚠️ knowledge.txt no encontrado, continuando sin base de conocimiento");
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
- crearEvento: Usa esta herramienta cuando el usuario quiera agendar, programar, o recordar algo. Interpreta fechas relativas como "mañana", "el lunes", etc.
- solicitarContrato: Usa esta herramienta cuando el usuario se comprometa a un nuevo hábito. Genera un Contrato de Identidad visual basado en el modelo "Después de [ancla], haré [hábito]" de Tiny Habits (BJ Fogg). SIEMPRE identifica el ancla y el hábito antes de invocarla.
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: customGoogle("gemini-1.5-pro"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      crearEvento: {
        description:
          "Crea un evento o recordatorio en el calendario del usuario. Usa esta herramienta cuando el usuario quiera agendar, programar, o crear un recordatorio para algo.",
        parameters: z.object({
          titulo: z
            .string()
            .describe("Nombre descriptivo del evento (ej: 'Fútbol con amigos')"),
          fecha: z
            .string()
            .describe(
              "Fecha del evento en formato legible en español (ej: 'Viernes, 25 de abril')"
            ),
          hora: z
            .string()
            .describe("Hora o rango horario del evento (ej: '17:00 - 18:30')"),
          ubicacion: z
            .string()
            .optional()
            .describe("Ubicación del evento si se menciona"),
        }),
        execute: async ({ titulo, fecha, hora, ubicacion }) => {
          return {
            titulo,
            fecha,
            hora,
            ubicacion: ubicacion || undefined,
            estado: "pendiente",
            creadoEn: new Date().toISOString(),
          };
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
