import { sleep } from "workflow";

// Step 1: Define a retryable unit of work
export async function sendFollowUpNotification(usuario: string, habito: string) {
  "use step";
  
  console.log("=========================================");
  console.log(`🔔 [NEUROCOACH PROACTIVE FOLLOW-UP]`);
  console.log(`Hola ${usuario}, soy tu NeuroCoach.`);
  console.log(`Han pasado 24h desde que firmaste tu Contrato de Identidad.`);
  console.log(`¿Pudiste cumplir tu hábito: "${habito}"?`);
  console.log(`Recuerda que los pequeños pasos construyen grandes cambios.`);
  console.log("=========================================");
  
  return { success: true, verified: true, timestamp: new Date().toISOString() };
}

// Orchestrator: Defines the workflow logic
export async function followUpWorkflow(data: { usuario: string, habito: string, ancla: string }) {
  "use workflow";

  console.log(`[Workflow] 📝 Iniciando motor de seguimiento para el hábito: ${data.habito}`);

  // Simular una espera de 24 horas (usamos 1 minuto para poder probarlo fácilmente)
  await sleep("1m");

  // Después de la pausa, el workflow hace el follow-up
  const result = await sendFollowUpNotification(data.usuario, data.habito);

  console.log(`[Workflow] ✅ Ciclo de seguimiento completado. Resultado:`, result);

  return result;
}
