'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    id: '1',
    question: '¿Qué es NeuroCoach?',
    answer:
      'Es un agente inteligente fundamentado en la ciencia conductual de autores como James Clear y BJ Fogg para ayudarte a construir hábitos.',
  },
  {
    id: '2',
    question: '¿Cómo usa la IA? (Track MCP)',
    answer:
      'Utilizamos el Model Context Protocol (MCP) para conectar al agente con una base de datos científica externa, evitando alucinaciones.',
  },
  {
    id: '3',
    question: '¿Qué pasa si me olvido de entrar? (Track WDK)',
    answer:
      'Usamos Vercel Workflow Agents. El agente programa un flujo asincrónico y duradero que despierta a las 24 horas para preguntarte cómo te fue.',
  },
  {
    id: '4',
    question: '¿Qué impacto social tiene?',
    answer:
      'NeuroCoach democratiza el acceso a la ciencia conductual, funcionando como salud mental preventiva para reducir el burnout y mejorar tu calidad de vida sin depender de un coach costoso.',
  },
]

export function FAQsAccordion() {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border-b border-slate-200 dark:border-slate-700">
            <AccordionTrigger className="hover:text-emerald-600 dark:hover:text-emerald-500">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-400">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
