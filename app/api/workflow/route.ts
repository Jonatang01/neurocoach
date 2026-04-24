import { sleep } from "workflow";
import { start } from "workflow/api";
import { NextResponse } from "next/server";

// Step function: tiene acceso completo a Node.js
async function enviarNotificacionSeguimiento(
  userId: string,
  habito: string,
  ancla?: string
) {
  "use step";

  console.log("=========================================");
  console.log(`🔔 [NEUROCOACH FOLLOW-UP PROACTIVO]`);
  console.log(`Usuario: ${userId}`);
  console.log(`¡Hola! Han pasado 24 horas desde que firmaste tu Contrato de Identidad.`);
  console.log(`¿Pudiste cumplir tu hábito: "${habito}"?`);
  if (ancla) {
    console.log(`Recuerda: Después de "${ancla}", harás "${habito}".`);
  }
  console.log(`Los pequeños pasos construyen grandes cambios.`);
  console.log("=========================================");

  // Aquí podrías integrar con tu sistema de notificaciones (push, email, etc.)
  return {
    success: true,
    userId,
    habito,
    ancla,
    notificadoEn: new Date().toISOString(),
  };
}

// Workflow principal: orquestación durable
export async function habitFollowUpWorkflow(data: {
  userId: string;
  habito: string;
  ancla?: string;
}) {
  "use workflow";

  const { userId, habito, ancla } = data;

  console.log(`[Workflow] 📝 Iniciando seguimiento para: ${habito}`);

  // Esperar 24 horas (el workflow sobrevive reinicios del servidor)
  await sleep("24h");

  // Ejecutar el step de notificación
  const resultado = await enviarNotificacionSeguimiento(userId, habito, ancla);

  console.log(`[Workflow] ✅ Seguimiento completado para ${userId}`);

  return resultado;
}

// API Route handler
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.usuario || !data.habito) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (usuario, habito)" },
        { status: 400 }
      );
    }

    // Iniciar el workflow durable
    const run = await start(habitFollowUpWorkflow, [
      {
        userId: data.usuario,
        habito: data.habito,
        ancla: data.ancla,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Workflow de seguimiento iniciado correctamente",
      runId: run.runId,
    });
  } catch (error) {
    console.error("Error iniciando el workflow:", error);
    return NextResponse.json(
      { error: "Error al iniciar el seguimiento" },
      { status: 500 }
    );
  }
}
