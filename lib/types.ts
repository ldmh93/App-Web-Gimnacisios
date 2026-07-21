/**
 * Tipos de dominio de FITCORE.
 * Preparados para migrar a Prisma/PostgreSQL: cada entidad tiene `id` estable
 * y las relaciones se expresan por id (exerciseId, routineId...).
 */

export type MuscleGroup =
  | "pecho"
  | "espalda"
  | "pierna"
  | "gluteo"
  | "hombro"
  | "biceps"
  | "triceps"
  | "abdomen"
  | "cardio"
  | "movilidad";

export type Level = "principiante" | "intermedio" | "avanzado";

export type Goal =
  | "perder-grasa"
  | "ganar-musculo"
  | "mantenimiento"
  | "recomposicion";

export type Sex = "hombre" | "mujer";

export type ActivityLevel =
  | "sedentario"
  | "ligero"
  | "moderado"
  | "activo"
  | "muy-activo";

/* ------------------------------ Ejercicios ------------------------------ */

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  muscles: string[];
  level: Level;
  equipment: string;
  sets: number;
  reps: string;
  rest: string;
  technique: string[];
  /** Opcionales: los ejercicios importados del dataset no los incluyen. */
  commonMistakes?: string[];
  tips?: string[];
  /** Ruta de imagen explícita (si no, se busca /exercises/<id>.jpg|png|webp). */
  image?: string;
  /** GIF animado del movimiento (se muestra en la ficha). */
  gif?: string;
  /** Crédito obligatorio del medio (p. ej. © Gym Visual). */
  attribution?: string;
}

/* ------------------------------- Rutinas -------------------------------- */

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps: string;
}

export interface RoutineDay {
  name: string;
  exercises: RoutineExercise[];
}

export interface PredefinedRoutine {
  id: string;
  name: string;
  level: Level;
  goal: string;
  daysPerWeek: number;
  /** Etiqueta de frecuencia personalizada (p. ej. "rotación de 9 días"). */
  frequency?: string;
  description: string;
  days: RoutineDay[];
}

export interface CustomRoutine {
  id: string;
  name: string;
  muscles: MuscleGroup[];
  exercises: RoutineExercise[];
  createdAt: string;
}

/* --------------------------- Sesión de entreno -------------------------- */

export interface SetLog {
  done: boolean;
  weight: string;
  reps: string;
}

export interface ExerciseLog {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: string;
  sets: SetLog[];
  notes: string;
}

export interface WorkoutSession {
  id: string;
  routineName: string;
  date: string;
  exercises: ExerciseLog[];
  completed: boolean;
}

/* ------------------------------- Nutrición ------------------------------ */

export interface UserProfile {
  age: number;
  sex: Sex;
  weight: number;
  height: number;
  activity: ActivityLevel;
  goal: Goal;
  targetWeight?: number;
  /* Datos de socio (perfil simulado, sin base de datos todavía). */
  name?: string;
  /** Foto del socio como data URL (guardada en LocalStorage). */
  avatar?: string;
  level?: Level;
  daysPerWeek?: number;
  memberNumber?: string;
  /** Fecha de alta en formato ISO (YYYY-MM-DD). */
  memberSince?: string;
  plan?: string;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface NutritionResult extends MacroTargets {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  maintenanceCalories: number;
}

export interface Meal {
  name: "Desayuno" | "Comida" | "Cena" | "Snacks";
  title: string;
  ingredients: string[];
  preparation: string;
}

export interface Diet {
  id: string;
  name: string;
  goal: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: Meal[];
}

/* ------------------------------ Suplementos ----------------------------- */

export interface Supplement {
  id: string;
  name: string;
  what: string;
  purpose: string;
  benefits: string[];
  howToTake: string;
  dose: string;
  relatedFoods: string[];
  myths: string[];
  recommendations: string[];
}

/* ------------------------------- Educación ------------------------------ */

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readMinutes: number;
  summary: string;
  sections: ArticleSection[];
}

/* -------------------------------- Progreso ------------------------------ */

export interface Measurements {
  arm?: number;
  chest?: number;
  waist?: number;
  leg?: number;
}

export interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  measurements: Measurements;
}
