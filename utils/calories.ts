import type { ActivityLevel, Goal, GoalPace, Sex } from "@/lib/types";

/** Factores de actividad (multiplicador del metabolismo basal). */
export const ACTIVITY_FACTORS: Record<
  ActivityLevel,
  { label: string; factor: number }
> = {
  sedentario: { label: "Sedentario (poco o nada de ejercicio)", factor: 1.2 },
  ligero: { label: "Ligero (1-3 días/semana)", factor: 1.375 },
  moderado: { label: "Moderado (3-5 días/semana)", factor: 1.55 },
  activo: { label: "Activo (6-7 días/semana)", factor: 1.725 },
  "muy-activo": { label: "Muy activo (trabajo físico + entreno)", factor: 1.9 },
};

/** Ajuste calórico según objetivo (kcal sobre mantenimiento). */
export const GOAL_ADJUSTMENTS: Record<
  Goal,
  { label: string; adjustment: number }
> = {
  "perder-grasa": { label: "Perder grasa", adjustment: -450 },
  "ganar-musculo": { label: "Ganar músculo", adjustment: 300 },
  mantenimiento: { label: "Mantenimiento", adjustment: 0 },
  recomposicion: { label: "Recomposición corporal", adjustment: -150 },
  rendimiento: { label: "Mejorar rendimiento", adjustment: 150 },
};

/**
 * Ritmo del objetivo: multiplica el déficit o superávit base.
 *
 * Los tres son sostenibles a propósito. Incluso el más decidido se queda en
 * torno a 0,5-0,6 kg por semana, que es el techo razonable: por encima se
 * pierde músculo junto con la grasa, y el plan deja de cumplirse a las dos
 * semanas. No se ofrece un ritmo agresivo porque no sería honesto.
 */
export const PACE_FACTORS: Record<
  GoalPace,
  { label: string; hint: string; factor: number }
> = {
  suave: {
    label: "Con calma",
    hint: "Cambios pequeños, muy fáciles de sostener",
    factor: 0.6,
  },
  moderado: {
    label: "Equilibrado",
    hint: "El ritmo que recomendamos para la mayoría",
    factor: 1,
  },
  decidido: {
    label: "Decidido",
    hint: "Más exigente, requiere constancia",
    factor: 1.4,
  },
};

/** IMC = peso (kg) / altura² (m). */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const meters = heightCm / 100;
  if (meters <= 0) return 0;
  return Math.round((weightKg / (meters * meters)) * 10) / 10;
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Peso saludable";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidad";
}

/** Metabolismo basal — fórmula Mifflin-St Jeor. */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "hombre" ? base + 5 : base - 161);
}

/** Calorías de mantenimiento (TDEE). */
export function calculateMaintenance(
  bmr: number,
  activity: ActivityLevel
): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activity].factor);
}

/** Calorías objetivo según la meta del usuario. */
export function calculateTargetCalories(
  maintenance: number,
  goal: Goal,
  pace: GoalPace = "moderado"
): number {
  const adjustment = GOAL_ADJUSTMENTS[goal].adjustment * PACE_FACTORS[pace].factor;
  // Suelo de seguridad: por debajo de 1200 kcal el plan deja de ser razonable.
  return Math.max(1200, Math.round(maintenance + adjustment));
}
