"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQsAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem value="what-is" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Que es NeuroCoach?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Un agente basado en ciencia conductual (James Clear, BJ Fogg) para ayudarte a construir habitos saludables. Utilizamos principios de neurociencia para hacer el cambio mas accesible y sostenible.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mcp" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Como usa la IA? (Track MCP)
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Utilizamos el Model Context Protocol (MCP) para conectar al agente con literatura clinica real, evitando alucinaciones. Asi garantizamos que todos los consejos estan respaldados por evidencia cientifica.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wdk" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Que pasa si me olvido de entrar? (Track WDK)
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Aqui usamos Vercel Workflow Agents. El agente programa un flujo asincronico que despierta a las 24 horas para preguntarte como te fue, sin consumir recursos en tu telefono. Es como tener un coach que nunca duerme.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="impact" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Cual es el impacto social?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Democratizamos el acceso a la salud mental preventiva, ayudando al trabajador a reducir la friccion, combatir el burnout y mejorar su calidad de vida de forma accesible. Creemos que la salud mental es un derecho, no un lujo.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
