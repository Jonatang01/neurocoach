"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQsAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem value="what-is" className="border-b border-gray-200">
        <AccordionTrigger className="text-left font-semibold text-gray-900">
          ¿Qué es NeuroCoach?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600">
          Un agente basado en ciencia conductual (James Clear, BJ Fogg) para ayudarte a construir hábitos saludables. Utilizamos principios de neurociencia para hacer el cambio más accesible y sostenible.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mcp" className="border-b border-gray-200">
        <AccordionTrigger className="text-left font-semibold text-gray-900">
          ¿Cómo usa la IA? (Track MCP)
        </AccordionTrigger>
        <AccordionContent className="text-gray-600">
          Utilizamos el Model Context Protocol (MCP) para conectar al agente con literatura clínica real, evitando alucinaciones. Así garantizamos que todos los consejos están respaldados por evidencia científica.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wdk" className="border-b border-gray-200">
        <AccordionTrigger className="text-left font-semibold text-gray-900">
          ¿Qué pasa si me olvido de entrar? (Track WDK)
        </AccordionTrigger>
        <AccordionContent className="text-gray-600">
          Aquí usamos Vercel Workflow Agents. El agente programa un flujo asincrónico que despierta a las 24 horas para preguntarte cómo te fue, sin consumir recursos en tu teléfono. Es como tener un coach que nunca duerme.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="impact" className="border-b border-gray-200">
        <AccordionTrigger className="text-left font-semibold text-gray-900">
          ¿Cuál es el impacto social?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600">
          Democratizamos el acceso a la salud mental preventiva, ayudando al trabajador a reducir la fricción, combatir el burnout y mejorar su calidad de vida de forma accesible. Creemos que la salud mental es un derecho, no un lujo.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
