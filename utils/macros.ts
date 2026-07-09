import type { Goal, MacroTargets, NutritionResult, UserProfile } from "@/lib/types";
import {
  bmiCategory,
  calculateBMI,
  calculateBMR,
  calculateMaintenance,
  calculateTargetCalories,
} from "./calories";

/** Gramos de proteína por kg de peso corporal según objetivo. */
const PROTEIN_PER_KG: Record<Goal, number> = {
  "perder-grasa": 2.2,
  "ganar-musculo": 2.0,
  mantenimiento: 1.8,
  recomposicion: 2.2,
};

/** Porcentaje de calorías destinado a grasas según objetivo. */
const FAT_RATIO: Record<Goal, number> = {
  "perder-grasa": 0.25,
  "ganar-musculo": 0.25,
  mantenimiento: 0.3,
  recomposicion: 0.28,
};

/**
 * Reparto de macronutrientes:
 * proteína por kg de peso, grasas como % de calorías y el resto carbohidratos.
 */
export function calculateMacros(
  calories: number,
  weightKg: number,
  goal: Goal
): MacroTargets {
  const protein = Math.round(weightKg * PROTEIN_PER_KG[goal]);
  const fats = Math.round((calories * FAT_RATIO[goal]) / 9);
  const carbs = Math.max(
    0,
    Math.round((calories - protein * 4 - fats * 9) / 4)
  );
  return { calories, protein, carbs, fats };
}

/** Cálculo completo a partir del perfil del usuario. */
export function calculateNutrition(profile: UserProfile): NutritionResult {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(
    profile.weight,
    profile.height,
    profile.age,
    profile.sex
  );
  const maintenanceCalories = calculateMaintenance(bmr, profile.activity);
  const calories = calculateTargetCalories(maintenanceCalories, profile.goal);
  const macros = calculateMacros(calories, profile.weight, profile.goal);

  return {
    ...macros,
    bmi,
    bmiCategory: bmiCategory(bmi),
    bmr,
    maintenanceCalories,
  };
}
