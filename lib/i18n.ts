export type Lang = "es" | "en"

export const translations = {
  es: {
    // Header
    appName: "NeuroCoach",
    appSubtitle: "Tu coach de hábitos inteligente",
    level: "Nivel",
    points: "pts",
    faqTitle: "Preguntas Frecuentes",
    faqSubtitle: "Cómo funciona NeuroCoach",
    toggleDark: "Modo oscuro",
    toggleLight: "Modo claro",
    toggleLang: "Switch to English",

    // FAQ
    faq: [
      {
        id: "what",
        question: "¿Qué es NeuroCoach?",
        answer:
          "Un agente basado en la ciencia conductual de James Clear y BJ Fogg para ayudarte a construir hábitos duraderos a través de pequeños compromisos sostenibles.",
        emoji: "🧠",
      },
      {
        id: "mcp",
        question: "¿Cómo usa la IA? (Track MCP)",
        answer:
          "Usamos el Model Context Protocol (MCP) para conectar al agente con bases de datos científicas y evitar alucinaciones. Cada respuesta está anclada en evidencia conductual verificable.",
        emoji: "🔬",
      },
      {
        id: "wdk",
        question: "¿Qué pasa si me olvido de entrar? (Track WDK)",
        answer:
          "Usamos Vercel Workflow Agents. El agente programa un flujo asincrónico que despierta a las 24 horas para preguntarte cómo te fue, sin consumir batería ni requerir que estés en la app.",
        emoji: "⏰",
      },
      {
        id: "impact",
        question: "Impacto social",
        answer:
          "Democratizamos el acceso a la ciencia conductual, funcionando como salud mental preventiva para reducir el burnout y mejorar tu calidad de vida, sin importar tu nivel de ingresos.",
        emoji: "🌍",
      },
    ],

    // Onboarding
    onboardingHeading: "NeuroCoach: Tu espacio seguro",
    onboardingSubheading: "para construir hábitos",
    onboardingByline: "Basado en la ciencia conductual de",
    onboardingAnd: "y",
    onboardingChallenge: "¿Cuál es tu desafío hoy?",
    onboardingOr: "o",
    onboardingInvite:
      "Elige una opción arriba o simplemente cuéntame,",
    onboardingInviteBold: "¿qué desafío enfrentas hoy?",

    // Impact chips
    chips: [
      {
        id: "burnout",
        label: "Burnout",
        description: "Estoy agotado y sin energía",
      },
      {
        id: "constancia",
        label: "Falta de constancia",
        description: "Empiezo hábitos pero no los sostengo",
      },
      {
        id: "estres",
        label: "Estrés",
        description: "Me cuesta manejar el estrés diario",
      },
    ],

    // Chat input
    inputPlaceholder: "Escribe un mensaje...",
    inputListening: "Escuchando...",
    micStart: "Grabar mensaje de voz",
    micStop: "Detener grabación",
    send: "Enviar mensaje",

    // MCP loader
    mcpLoading: "Consultando base de datos científica (MCP)...",

    // Error
    connectionError: "Error de conexión",
    connectionErrorDetail:
      "No se pudo conectar con el coach. Verificá tu conexión.",

    // HabitContract
    contractTitle: "Contrato de Identidad",
    contractSubtitle: "Basado en ciencia conductual • BJ Fogg",
    contractCommit: "Yo me comprometo a que",
    contractAfter: "Después de",
    contractWillDo: "haré",
    contractTinyHabits: "Tiny Habits®",
    contractPoints: "+50 pts al firmar",
    contractSign: "Firmar y Activar Seguimiento",
    contractSigning: "Firmando y activando seguimiento...",
    contractSigned: "Contrato firmado — Seguimiento activo",
    contractWdk: "Activar Seguimiento WDK (24hs)",
    contractWdkActivating: "Programando workflow...",
    contractWdkActive: "Workflow WDK activo — Te contactamos en 24hs",
    contractReminder: "NeuroCoach te recordará en 24h para verificar tu progreso 🔔",
    toastTitle: "Workflow durable iniciado.",
    toastBody: "El agente te contactará mañana ✓",
  },

  en: {
    // Header
    appName: "NeuroCoach",
    appSubtitle: "Your intelligent habit coach",
    level: "Level",
    points: "pts",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "How NeuroCoach works",
    toggleDark: "Dark mode",
    toggleLight: "Light mode",
    toggleLang: "Cambiar a Español",

    // FAQ
    faq: [
      {
        id: "what",
        question: "What is NeuroCoach?",
        answer:
          "An agent based on the behavioral science of James Clear and BJ Fogg to help you build lasting habits through small, sustainable commitments.",
        emoji: "🧠",
      },
      {
        id: "mcp",
        question: "How does the AI work? (MCP Track)",
        answer:
          "We use the Model Context Protocol (MCP) to connect the agent with scientific databases and avoid hallucinations. Every response is anchored in verifiable behavioral evidence.",
        emoji: "🔬",
      },
      {
        id: "wdk",
        question: "What if I forget to check in? (WDK Track)",
        answer:
          "We use Vercel Workflow Agents. The agent schedules an asynchronous flow that wakes up after 24 hours to ask how you did, without draining your battery or requiring you to be in the app.",
        emoji: "⏰",
      },
      {
        id: "impact",
        question: "Social impact",
        answer:
          "We democratize access to behavioral science, functioning as preventive mental health care to reduce burnout and improve your quality of life, regardless of your income level.",
        emoji: "🌍",
      },
    ],

    // Onboarding
    onboardingHeading: "NeuroCoach: Your safe space",
    onboardingSubheading: "to build habits",
    onboardingByline: "Based on the behavioral science of",
    onboardingAnd: "and",
    onboardingChallenge: "What's your challenge today?",
    onboardingOr: "or",
    onboardingInvite: "Choose an option above or simply tell me,",
    onboardingInviteBold: "what challenge are you facing today?",

    // Impact chips
    chips: [
      {
        id: "burnout",
        label: "Burnout",
        description: "I'm exhausted and out of energy",
      },
      {
        id: "constancia",
        label: "Lack of consistency",
        description: "I start habits but can't keep them up",
      },
      {
        id: "estres",
        label: "Stress",
        description: "I struggle to manage daily stress",
      },
    ],

    // Chat input
    inputPlaceholder: "Type a message...",
    inputListening: "Listening...",
    micStart: "Record voice message",
    micStop: "Stop recording",
    send: "Send message",

    // MCP loader
    mcpLoading: "Querying scientific database (MCP)...",

    // Error
    connectionError: "Connection error",
    connectionErrorDetail:
      "Could not connect to the coach. Check your connection.",

    // HabitContract
    contractTitle: "Identity Contract",
    contractSubtitle: "Based on behavioral science • BJ Fogg",
    contractCommit: "I commit to",
    contractAfter: "After",
    contractWillDo: "I will",
    contractTinyHabits: "Tiny Habits®",
    contractPoints: "+50 pts on signing",
    contractSign: "Sign and Activate Tracking",
    contractSigning: "Signing and activating tracking...",
    contractSigned: "Contract signed — Tracking active",
    contractWdk: "Activate WDK Tracking (24h)",
    contractWdkActivating: "Scheduling workflow...",
    contractWdkActive: "WDK Workflow active — We'll reach out in 24h",
    contractReminder: "NeuroCoach will remind you in 24h to check your progress 🔔",
    toastTitle: "Durable workflow started.",
    toastBody: "The agent will contact you tomorrow ✓",
  },
} as const

export type Translations = (typeof translations)["es"]
