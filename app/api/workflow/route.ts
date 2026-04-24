import { NextResponse } from 'next/server';
import { start } from 'workflow/api';
import { followUpWorkflow } from '@/app/workflows/habit-followup';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.usuario || !data.habito) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (usuario, habito)" },
        { status: 400 }
      );
    }

    // Start the workflow; returns a run object immediately
    const run = await start(followUpWorkflow, {
      args: [data],
    });

    return NextResponse.json({ 
      success: true,
      message: "Workflow de seguimiento iniciado correctamente",
      runId: run.id 
    });
  } catch (error) {
    console.error("Error iniciando el workflow:", error);
    return NextResponse.json(
      { error: "Error al iniciar el seguimiento" },
      { status: 500 }
    );
  }
}
