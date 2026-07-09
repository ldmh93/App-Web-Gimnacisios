import type { PredefinedRoutine } from "@/lib/types";

/**
 * Rutinas predefinidas de FITCORE.
 * Los ejercicios se referencian por id contra data/exercises.ts.
 */
export const PREDEFINED_ROUTINES: PredefinedRoutine[] = [
  /* ----------------------------- Principiantes ---------------------------- */
  {
    id: "full-body-3",
    name: "Full Body 3 días",
    level: "principiante",
    goal: "Base muscular general",
    daysPerWeek: 3,
    description:
      "El punto de partida ideal: todo el cuerpo en cada sesión, 3 veces por semana con al menos un día de descanso entre sesiones. Frecuencia alta y técnica primero.",
    days: [
      {
        name: "Día A — Cuerpo completo",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 3, reps: "10" },
          { exerciseId: "press-banca", sets: 3, reps: "10" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "12" },
          { exerciseId: "elevaciones-laterales", sets: 3, reps: "15" },
          { exerciseId: "plancha", sets: 3, reps: "30-45 s" },
        ],
      },
      {
        name: "Día B — Cuerpo completo",
        exercises: [
          { exerciseId: "prensa", sets: 3, reps: "12" },
          { exerciseId: "press-inclinado-mancuernas", sets: 3, reps: "12" },
          { exerciseId: "remo-barra", sets: 3, reps: "10" },
          { exerciseId: "curl-barra", sets: 3, reps: "12" },
          { exerciseId: "crunch-polea", sets: 3, reps: "15" },
        ],
      },
      {
        name: "Día C — Cuerpo completo",
        exercises: [
          { exerciseId: "peso-muerto-rumano", sets: 3, reps: "10" },
          { exerciseId: "hip-thrust", sets: 3, reps: "12" },
          { exerciseId: "press-militar", sets: 3, reps: "10" },
          { exerciseId: "extension-polea", sets: 3, reps: "15" },
          { exerciseId: "caminata-inclinada", sets: 1, reps: "20 min" },
        ],
      },
    ],
  },
  {
    id: "adaptacion-gym",
    name: "Adaptación al gimnasio",
    level: "principiante",
    goal: "Aprender patrones y crear el hábito",
    daysPerWeek: 2,
    description:
      "Dos sesiones semanales centradas en máquinas y ejercicios sencillos para aprender los patrones de movimiento sin agujetas paralizantes. Perfecta para tus primeras 4 semanas.",
    days: [
      {
        name: "Sesión 1 — Empuje + Pierna",
        exercises: [
          { exerciseId: "gato-camello", sets: 2, reps: "10" },
          { exerciseId: "prensa", sets: 3, reps: "12" },
          { exerciseId: "press-inclinado-mancuernas", sets: 3, reps: "12" },
          { exerciseId: "extension-polea", sets: 2, reps: "15" },
          { exerciseId: "plancha", sets: 2, reps: "20-30 s" },
        ],
      },
      {
        name: "Sesión 2 — Tirón + Glúteo",
        exercises: [
          { exerciseId: "sentadilla-profunda", sets: 2, reps: "30 s" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "12" },
          { exerciseId: "hip-thrust", sets: 3, reps: "12" },
          { exerciseId: "curl-martillo", sets: 2, reps: "12" },
          { exerciseId: "caminata-inclinada", sets: 1, reps: "15 min" },
        ],
      },
    ],
  },
  {
    id: "perdida-grasa",
    name: "Pérdida de grasa",
    level: "principiante",
    goal: "Quemar grasa preservando músculo",
    daysPerWeek: 4,
    description:
      "Combina fuerza en circuito con cardio estratégico. Las pesas mantienen tu músculo mientras el déficit calórico hace el trabajo de quemar grasa.",
    days: [
      {
        name: "Día 1 — Fuerza total + cardio",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 3, reps: "12" },
          { exerciseId: "press-banca", sets: 3, reps: "12" },
          { exerciseId: "remo-barra", sets: 3, reps: "12" },
          { exerciseId: "plancha", sets: 3, reps: "30-45 s" },
          { exerciseId: "caminata-inclinada", sets: 1, reps: "20 min" },
        ],
      },
      {
        name: "Día 2 — HIIT",
        exercises: [
          { exerciseId: "hiit-bici", sets: 8, reps: "30 s / 90 s" },
          { exerciseId: "crunch-polea", sets: 3, reps: "15" },
          { exerciseId: "sentadilla-profunda", sets: 2, reps: "45 s" },
        ],
      },
      {
        name: "Día 3 — Fuerza total",
        exercises: [
          { exerciseId: "prensa", sets: 3, reps: "15" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "12" },
          { exerciseId: "press-militar", sets: 3, reps: "12" },
          { exerciseId: "hip-thrust", sets: 3, reps: "15" },
          { exerciseId: "elevaciones-laterales", sets: 2, reps: "15" },
        ],
      },
      {
        name: "Día 4 — Cardio suave + movilidad",
        exercises: [
          { exerciseId: "remo-maquina", sets: 1, reps: "20 min" },
          { exerciseId: "gato-camello", sets: 2, reps: "12" },
          { exerciseId: "apertura-toracica", sets: 2, reps: "10" },
        ],
      },
    ],
  },

  /* ------------------------------ Intermedios ----------------------------- */
  {
    id: "push-pull-legs",
    name: "Push Pull Legs",
    level: "intermedio",
    goal: "Hipertrofia con frecuencia 2",
    daysPerWeek: 6,
    description:
      "El clásico PPL: empuje, tirón y pierna repetidos dos veces por semana. Volumen alto y gran organización por patrones de movimiento.",
    days: [
      {
        name: "Push — Pecho, hombro y tríceps",
        exercises: [
          { exerciseId: "press-banca", sets: 4, reps: "8-10" },
          { exerciseId: "press-inclinado-mancuernas", sets: 4, reps: "10-12" },
          { exerciseId: "press-militar", sets: 3, reps: "8-10" },
          { exerciseId: "elevaciones-laterales", sets: 4, reps: "12-15" },
          { exerciseId: "press-frances", sets: 3, reps: "10-12" },
          { exerciseId: "extension-polea", sets: 3, reps: "12-15" },
        ],
      },
      {
        name: "Pull — Espalda y bíceps",
        exercises: [
          { exerciseId: "dominadas", sets: 4, reps: "6-10" },
          { exerciseId: "remo-barra", sets: 4, reps: "8-10" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "10-12" },
          { exerciseId: "pajaros", sets: 3, reps: "15" },
          { exerciseId: "curl-barra", sets: 3, reps: "10" },
          { exerciseId: "curl-martillo", sets: 3, reps: "12" },
        ],
      },
      {
        name: "Legs — Pierna completa",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 4, reps: "8-10" },
          { exerciseId: "prensa", sets: 4, reps: "10-12" },
          { exerciseId: "peso-muerto-rumano", sets: 3, reps: "10" },
          { exerciseId: "curl-femoral", sets: 3, reps: "12" },
          { exerciseId: "hip-thrust", sets: 3, reps: "12" },
          { exerciseId: "plancha", sets: 3, reps: "45 s" },
        ],
      },
    ],
  },
  {
    id: "torso-pierna",
    name: "Torso / Pierna",
    level: "intermedio",
    goal: "Equilibrio entre fuerza e hipertrofia",
    daysPerWeek: 4,
    description:
      "Cuatro días alternando torso y pierna. Frecuencia 2 por grupo muscular con sesiones de menos de una hora. La mejor relación resultados/tiempo.",
    days: [
      {
        name: "Torso A — Fuerza",
        exercises: [
          { exerciseId: "press-banca", sets: 4, reps: "6-8" },
          { exerciseId: "remo-barra", sets: 4, reps: "6-8" },
          { exerciseId: "press-militar", sets: 3, reps: "8" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "10" },
          { exerciseId: "curl-barra", sets: 2, reps: "10" },
          { exerciseId: "extension-polea", sets: 2, reps: "12" },
        ],
      },
      {
        name: "Pierna A — Fuerza",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 4, reps: "6-8" },
          { exerciseId: "peso-muerto-rumano", sets: 3, reps: "8" },
          { exerciseId: "prensa", sets: 3, reps: "10" },
          { exerciseId: "curl-femoral", sets: 3, reps: "12" },
          { exerciseId: "plancha", sets: 3, reps: "45 s" },
        ],
      },
      {
        name: "Torso B — Hipertrofia",
        exercises: [
          { exerciseId: "press-inclinado-mancuernas", sets: 4, reps: "10-12" },
          { exerciseId: "dominadas", sets: 4, reps: "8-12" },
          { exerciseId: "aperturas-polea", sets: 3, reps: "12-15" },
          { exerciseId: "elevaciones-laterales", sets: 4, reps: "15" },
          { exerciseId: "curl-inclinado", sets: 3, reps: "12" },
          { exerciseId: "press-frances", sets: 3, reps: "12" },
        ],
      },
      {
        name: "Pierna B — Hipertrofia",
        exercises: [
          { exerciseId: "prensa", sets: 4, reps: "12-15" },
          { exerciseId: "zancadas", sets: 3, reps: "10-12" },
          { exerciseId: "hip-thrust", sets: 4, reps: "10-12" },
          { exerciseId: "abduccion-cadera", sets: 3, reps: "15-20" },
          { exerciseId: "crunch-polea", sets: 3, reps: "15" },
        ],
      },
    ],
  },

  /* ------------------------------- Avanzados ------------------------------ */
  {
    id: "hipertrofia-avanzada",
    name: "Hipertrofia avanzada",
    level: "avanzado",
    goal: "Máximo crecimiento muscular",
    daysPerWeek: 5,
    description:
      "Split de 5 días con volumen alto por grupo muscular, énfasis en la conexión mente-músculo y trabajo cercano al fallo. Requiere buena recuperación y nutrición.",
    days: [
      {
        name: "Día 1 — Pecho",
        exercises: [
          { exerciseId: "press-banca", sets: 4, reps: "8-10" },
          { exerciseId: "press-inclinado-mancuernas", sets: 4, reps: "10-12" },
          { exerciseId: "fondos-paralelas", sets: 3, reps: "10-12" },
          { exerciseId: "aperturas-polea", sets: 3, reps: "12-15" },
        ],
      },
      {
        name: "Día 2 — Espalda",
        exercises: [
          { exerciseId: "peso-muerto", sets: 3, reps: "5-6" },
          { exerciseId: "dominadas", sets: 4, reps: "8-10" },
          { exerciseId: "remo-barra", sets: 4, reps: "8-10" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "12" },
          { exerciseId: "pajaros", sets: 3, reps: "15" },
        ],
      },
      {
        name: "Día 3 — Pierna",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 5, reps: "8-10" },
          { exerciseId: "prensa", sets: 4, reps: "12" },
          { exerciseId: "peso-muerto-rumano", sets: 4, reps: "10" },
          { exerciseId: "curl-femoral", sets: 3, reps: "12-15" },
          { exerciseId: "zancadas", sets: 3, reps: "12" },
        ],
      },
      {
        name: "Día 4 — Hombro y abdomen",
        exercises: [
          { exerciseId: "press-militar", sets: 4, reps: "8" },
          { exerciseId: "elevaciones-laterales", sets: 5, reps: "12-15" },
          { exerciseId: "pajaros", sets: 4, reps: "15" },
          { exerciseId: "crunch-polea", sets: 4, reps: "12-15" },
          { exerciseId: "elevaciones-piernas", sets: 3, reps: "10" },
        ],
      },
      {
        name: "Día 5 — Brazo",
        exercises: [
          { exerciseId: "curl-barra", sets: 4, reps: "8-10" },
          { exerciseId: "press-frances", sets: 4, reps: "10" },
          { exerciseId: "curl-inclinado", sets: 3, reps: "12" },
          { exerciseId: "extension-polea", sets: 3, reps: "12-15" },
          { exerciseId: "curl-martillo", sets: 3, reps: "12" },
          { exerciseId: "fondos-banco", sets: 3, reps: "15" },
        ],
      },
    ],
  },
  {
    id: "fuerza",
    name: "Fuerza 5x5",
    level: "avanzado",
    goal: "Aumentar la fuerza máxima",
    daysPerWeek: 4,
    description:
      "Programa centrado en los básicos con series de 5 repeticiones y cargas altas. Progresión lineal semanal: añade 2.5 kg cuando completes todas las series.",
    days: [
      {
        name: "Día 1 — Sentadilla pesada",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 5, reps: "5" },
          { exerciseId: "prensa", sets: 3, reps: "8" },
          { exerciseId: "curl-femoral", sets: 3, reps: "10" },
          { exerciseId: "plancha", sets: 3, reps: "60 s" },
        ],
      },
      {
        name: "Día 2 — Press banca pesado",
        exercises: [
          { exerciseId: "press-banca", sets: 5, reps: "5" },
          { exerciseId: "press-militar", sets: 3, reps: "8" },
          { exerciseId: "fondos-paralelas", sets: 3, reps: "8-10" },
          { exerciseId: "extension-polea", sets: 3, reps: "12" },
        ],
      },
      {
        name: "Día 3 — Peso muerto pesado",
        exercises: [
          { exerciseId: "peso-muerto", sets: 5, reps: "5" },
          { exerciseId: "remo-barra", sets: 4, reps: "6-8" },
          { exerciseId: "dominadas", sets: 3, reps: "6-8" },
          { exerciseId: "curl-barra", sets: 3, reps: "10" },
        ],
      },
      {
        name: "Día 4 — Accesorios y debilidades",
        exercises: [
          { exerciseId: "press-inclinado-mancuernas", sets: 4, reps: "8-10" },
          { exerciseId: "hip-thrust", sets: 4, reps: "8" },
          { exerciseId: "elevaciones-laterales", sets: 3, reps: "15" },
          { exerciseId: "elevaciones-piernas", sets: 3, reps: "10" },
          { exerciseId: "apertura-toracica", sets: 2, reps: "10" },
        ],
      },
    ],
  },
  {
    id: "split-personal-9",
    name: "Split personal · rotación 9 días",
    level: "avanzado",
    goal: "Hipertrofia con máxima recuperación",
    daysPerWeek: 7,
    frequency: "Ciclo de 9 días",
    description:
      "Split rotativo que NO sigue los días de la semana: 3 días de entreno + descanso, luego 4 días más divididos + descanso, y vuelta a empezar. El bíceps se entrena con pecho y el tríceps con espalda para trabajarlos frescos (más estímulo). La segunda vuelta, más dividida, da atención y prioridad a cada grupo sin comprometer la recuperación. Días 4 y 9: descanso.",
    days: [
      {
        name: "Día 1 — Pectoral + Hombro + Bíceps",
        exercises: [
          { exerciseId: "press-banca", sets: 4, reps: "8-10" },
          { exerciseId: "press-inclinado-mancuernas", sets: 3, reps: "10-12" },
          { exerciseId: "press-militar", sets: 3, reps: "8-10" },
          { exerciseId: "elevaciones-laterales", sets: 3, reps: "12-15" },
          { exerciseId: "curl-barra", sets: 3, reps: "10" },
          { exerciseId: "curl-martillo", sets: 2, reps: "12" },
        ],
      },
      {
        name: "Día 2 — Tríceps + Espalda",
        exercises: [
          { exerciseId: "dominadas", sets: 4, reps: "6-10" },
          { exerciseId: "remo-barra", sets: 4, reps: "8-10" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "10-12" },
          { exerciseId: "press-frances", sets: 3, reps: "10-12" },
          { exerciseId: "extension-polea", sets: 3, reps: "12-15" },
        ],
      },
      {
        name: "Día 3 — Pierna (énfasis isquios)",
        exercises: [
          { exerciseId: "peso-muerto-rumano", sets: 4, reps: "8-10" },
          { exerciseId: "curl-femoral", sets: 4, reps: "10-12" },
          { exerciseId: "sentadilla-barra", sets: 3, reps: "8-10" },
          { exerciseId: "hip-thrust", sets: 3, reps: "10-12" },
          { exerciseId: "plancha", sets: 3, reps: "45 s" },
        ],
      },
      {
        name: "Día 5 — Pectoral + Bíceps",
        exercises: [
          { exerciseId: "press-inclinado-mancuernas", sets: 4, reps: "10-12" },
          { exerciseId: "aperturas-polea", sets: 3, reps: "12-15" },
          { exerciseId: "fondos-paralelas", sets: 3, reps: "10-12" },
          { exerciseId: "curl-inclinado", sets: 3, reps: "12" },
          { exerciseId: "curl-martillo", sets: 3, reps: "12" },
        ],
      },
      {
        name: "Día 6 — Espalda + Abs",
        exercises: [
          { exerciseId: "jalon-pecho", sets: 4, reps: "10-12" },
          { exerciseId: "remo-barra", sets: 4, reps: "8-10" },
          { exerciseId: "pajaros", sets: 3, reps: "15" },
          { exerciseId: "crunch-polea", sets: 3, reps: "12-15" },
          { exerciseId: "elevaciones-piernas", sets: 3, reps: "10" },
        ],
      },
      {
        name: "Día 7 — Hombro + Tríceps",
        exercises: [
          { exerciseId: "press-militar", sets: 4, reps: "8" },
          { exerciseId: "elevaciones-laterales", sets: 4, reps: "12-15" },
          { exerciseId: "pajaros", sets: 3, reps: "15" },
          { exerciseId: "press-frances", sets: 3, reps: "10-12" },
          { exerciseId: "extension-polea", sets: 3, reps: "12-15" },
        ],
      },
      {
        name: "Día 8 — Pierna (énfasis cuádriceps)",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 4, reps: "8-10" },
          { exerciseId: "prensa", sets: 4, reps: "10-12" },
          { exerciseId: "zancadas", sets: 3, reps: "10-12" },
          { exerciseId: "curl-femoral", sets: 2, reps: "12-15" },
          { exerciseId: "plancha", sets: 3, reps: "45 s" },
        ],
      },
    ],
  },
  {
    id: "definicion-avanzada",
    name: "Definición avanzada",
    level: "avanzado",
    goal: "Perder grasa manteniendo el máximo músculo",
    daysPerWeek: 5,
    description:
      "Pesas intensas para dar razones al cuerpo de conservar músculo, más cardio programado y densidad de entrenamiento alta. Diseñada para acompañar un déficit calórico.",
    days: [
      {
        name: "Día 1 — Torso pesado",
        exercises: [
          { exerciseId: "press-banca", sets: 4, reps: "6-8" },
          { exerciseId: "remo-barra", sets: 4, reps: "6-8" },
          { exerciseId: "press-militar", sets: 3, reps: "8" },
          { exerciseId: "jalon-pecho", sets: 3, reps: "10" },
        ],
      },
      {
        name: "Día 2 — Pierna pesada",
        exercises: [
          { exerciseId: "sentadilla-barra", sets: 4, reps: "6-8" },
          { exerciseId: "peso-muerto-rumano", sets: 4, reps: "8" },
          { exerciseId: "prensa", sets: 3, reps: "10" },
          { exerciseId: "plancha", sets: 3, reps: "60 s" },
        ],
      },
      {
        name: "Día 3 — HIIT + abdomen",
        exercises: [
          { exerciseId: "hiit-bici", sets: 8, reps: "30 s / 90 s" },
          { exerciseId: "crunch-polea", sets: 4, reps: "15" },
          { exerciseId: "elevaciones-piernas", sets: 3, reps: "10-12" },
        ],
      },
      {
        name: "Día 4 — Torso volumen",
        exercises: [
          { exerciseId: "press-inclinado-mancuernas", sets: 4, reps: "10-12" },
          { exerciseId: "dominadas", sets: 4, reps: "8-10" },
          { exerciseId: "elevaciones-laterales", sets: 4, reps: "15" },
          { exerciseId: "curl-barra", sets: 3, reps: "10-12" },
          { exerciseId: "press-frances", sets: 3, reps: "10-12" },
        ],
      },
      {
        name: "Día 5 — Pierna volumen + cardio",
        exercises: [
          { exerciseId: "prensa", sets: 4, reps: "12-15" },
          { exerciseId: "hip-thrust", sets: 4, reps: "10-12" },
          { exerciseId: "zancadas", sets: 3, reps: "12" },
          { exerciseId: "caminata-inclinada", sets: 1, reps: "25 min" },
        ],
      },
    ],
  },
];

export function getPredefinedRoutine(id: string): PredefinedRoutine | undefined {
  return PREDEFINED_ROUTINES.find((r) => r.id === id);
}
