import type { Goal, MacroTargets, NutritionResult, UserProfile } from "@/lib/types";
import { GOAL_ADJUSTMENTS, PACE_FACTORS } from "@/utils/calories";

/**
 * Plan nutricional del socio: el resultado calculado más la foto del anterior,
 * para poder enseñar en qué ha cambiado al recalcular.
 *
 * Las recomendaciones son ORIENTACIÓN GENERAL, nunca diagnóstico ni
 * tratamiento. Están escritas en condicional a propósito ("podrías empezar
 * con…") y la interfaz lo indica de forma visible junto a ellas.
 */

export interface NutritionPlan {
  /** Resultado vigente. */
  current: NutritionResult;
  /** Resultado anterior, si ya se había calculado antes. */
  previous?: MacroTargets;
  /** Fecha del cálculo vigente, en ISO. */
  calculatedAt: string;
  /** Peso con el que se calculó, para detectar cuándo conviene recalcular. */
  weightAtCalculation: number;
}

/** Diferencia de peso a partir de la cual se sugiere recalcular. */
export const RECALC_WEIGHT_DELTA = 2;

export const GOAL_META: Record<
  Goal,
  { emoji: string; label: string; short: string }
> = {
  "perder-grasa": {
    emoji: "🔥",
    label: "Perder grasa",
    short: "Bajar de peso cuidando el músculo",
  },
  "ganar-musculo": {
    emoji: "💪",
    label: "Ganar masa muscular",
    short: "Construir músculo de forma progresiva",
  },
  mantenimiento: {
    emoji: "⚖️",
    label: "Mantener mi peso",
    short: "Sostener tu punto actual",
  },
  recomposicion: {
    emoji: "🔄",
    label: "Recomposición corporal",
    short: "Menos grasa y más músculo a la vez",
  },
  rendimiento: {
    emoji: "🏋️",
    label: "Mejorar rendimiento",
    short: "Entrenar más fuerte y recuperar mejor",
  },
};

/**
 * Recomendación adaptada al objetivo.
 * Se devuelve en piezas para que la interfaz componga sin recortar texto.
 */
export function recommendation(profile: UserProfile): {
  title: string;
  body: string;
  points: string[];
} {
  const pace = PACE_FACTORS[profile.pace ?? "moderado"];

  switch (profile.goal) {
    case "perder-grasa":
      return {
        title: "Un déficit que puedas sostener",
        body: `Según tus datos podrías empezar con un déficit calórico moderado, a un ritmo ${pace.label.toLowerCase()}. La prioridad es mantener la proteína alta y acompañarlo con entrenamiento de fuerza: es lo que hace que bajes grasa y no músculo.`,
        points: [
          "Reparte la proteína entre todas las comidas del día.",
          "No bajes las calorías más de lo calculado: acelerar suele salir caro.",
          "Entrena fuerza al menos 3 días por semana.",
          "Pésate siempre en las mismas condiciones y mira la tendencia, no el día.",
        ],
      };
    case "ganar-musculo":
      return {
        title: "Un superávit ligero y paciente",
        body: `Para ganar músculo podrías partir de un superávit calórico ligero, a un ritmo ${pace.label.toLowerCase()}, con suficiente proteína y entrenamiento de fuerza progresivo. Subir muy rápido añade sobre todo grasa.`,
        points: [
          "Sube la carga o las repeticiones poco a poco, semana a semana.",
          "Duerme bien: el músculo se construye descansando, no entrenando.",
          "Si en un mes no sube nada el peso, ajusta las calorías al alza.",
        ],
      };
    case "mantenimiento":
      return {
        title: "Sostener lo que ya has conseguido",
        body: "Tu objetivo es rondar tu peso actual con una alimentación equilibrada y proteína suficiente para apoyar el entrenamiento. Mantener también es un objetivo, y suele ser el más subestimado.",
        points: [
          "Un margen de uno o dos kilos arriba y abajo es normal.",
          "Mantén el entrenamiento de fuerza aunque no busques cambios.",
        ],
      };
    case "recomposicion":
      return {
        title: "Menos grasa y más músculo a la vez",
        body: "Tu estrategia puede centrarse en mejorar la composición corporal: entrenamiento de fuerza, proteína alta y calorías cercanas a tu gasto. Es el camino más lento en la báscula y el que más se nota en el espejo.",
        points: [
          "La báscula se moverá poco: guíate por medidas y fotos.",
          "Prioriza la progresión de cargas por encima del cardio.",
          "Ten paciencia: los cambios se ven en meses, no en semanas.",
        ],
      };
    case "rendimiento":
      return {
        title: "Comer para entrenar mejor",
        body: "Para rendir más conviene comer en torno a tu gasto o ligeramente por encima, con carbohidratos suficientes alrededor del entrenamiento y una buena recuperación.",
        points: [
          "No entrenes en ayunas si buscas rendimiento máximo.",
          "Hidrátate durante la sesión, no solo al terminar.",
          "Respeta los días de descanso: forman parte del plan.",
        ],
      };
  }
}

/** Texto corto del ajuste aplicado, para el resumen. */
export function adjustmentSummary(profile: UserProfile): string {
  const goal = GOAL_ADJUSTMENTS[profile.goal];
  const pace = PACE_FACTORS[profile.pace ?? "moderado"];
  const delta = Math.round(goal.adjustment * pace.factor);
  if (delta === 0) return "En torno a tu gasto de mantenimiento";
  return delta < 0
    ? `${Math.abs(delta)} kcal por debajo de tu mantenimiento`
    : `${delta} kcal por encima de tu mantenimiento`;
}

/** Diferencia entre dos conjuntos de macros, para la comparación. */
export function macroDelta(
  previous: MacroTargets,
  current: MacroTargets
): Record<keyof MacroTargets, number> {
  return {
    calories: current.calories - previous.calories,
    protein: current.protein - previous.protein,
    carbs: current.carbs - previous.carbs,
    fats: current.fats - previous.fats,
  };
}
