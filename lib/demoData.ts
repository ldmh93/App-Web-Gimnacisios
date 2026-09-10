import { generateId, saveToStorage, STORAGE_KEYS } from "@/lib/storage";
import { getExercise } from "@/data/exercises";
import { todayKey } from "@/lib/workout";
import { calculateNutrition } from "@/utils/macros";
import type { NutritionPlan } from "@/lib/nutritionPlan";
import { createNotification, type AppNotification } from "@/lib/notifications";
import type {
  CustomRoutine,
  ProgressEntry,
  UserProfile,
  WorkoutSession,
} from "@/lib/types";

/**
 * Datos de demostración del socio.
 *
 * Sirven para enseñar la aplicación completa sin que ninguna pantalla aparezca
 * vacía: hay historial de entrenamientos, mediciones, récords, rutina propia,
 * favoritos y avisos. Todo es FICTICIO y se declara como tal en la interfaz.
 *
 * Se siembra una sola vez, marcado con `demoSeeded`, para que lo que el
 * visitante haga durante la demostración no se pise al recargar.
 */

export const DEMO_USER = {
  email: "demo@marafitness.app",
  password: "demo1234",
  name: "Andrea Salazar",
} as const;

/** Fecha de hace N días, en formato YYYY-MM-DD. */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Fecha ISO completa de hace N días, con hora de entreno verosímil. */
function isoDaysAgo(n: number, hour = 19): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
}

/* --------------------------------- Perfil -------------------------------- */

export const DEMO_PROFILE: UserProfile = {
  name: DEMO_USER.name,
  age: 29,
  sex: "mujer",
  weight: 64.2,
  height: 167,
  targetWeight: 60,
  activity: "moderado",
  goal: "recomposicion",
  pace: "moderado",
  trainingType: "fuerza",
  sessionMinutes: 65,
  level: "intermedio",
  daysPerWeek: 4,
  memberNumber: "MF-0142",
  memberSince: daysAgo(214),
  plan: "Mensualidad",
};

/* ------------------------------- Mediciones ------------------------------ */

/**
 * Doce semanas de progreso coherente con el objetivo de recomposición:
 * el peso baja poco, la cintura baja más y el brazo sube. Es justo lo que hace
 * creíble la demostración, y lo que se vería en un caso real.
 */
export const DEMO_PROGRESS: ProgressEntry[] = [
  { d: 84, w: 68.4, waist: 79.5, hip: 99.0, arm: 28.5, chest: 89, leg: 55.0, bf: 30.2 },
  { d: 70, w: 67.6, waist: 78.4, hip: 98.4, arm: 28.8, chest: 89, leg: 55.2, bf: 29.4 },
  { d: 56, w: 66.9, waist: 77.2, hip: 97.8, arm: 29.1, chest: 88, leg: 55.6, bf: 28.5 },
  { d: 42, w: 66.1, waist: 76.0, hip: 97.1, arm: 29.4, chest: 88, leg: 55.9, bf: 27.6 },
  { d: 28, w: 65.4, waist: 75.1, hip: 96.5, arm: 29.8, chest: 87, leg: 56.2, bf: 26.9 },
  { d: 14, w: 64.8, waist: 74.2, hip: 96.0, arm: 30.1, chest: 87, leg: 56.5, bf: 26.1 },
  { d: 3, w: 64.2, waist: 73.5, hip: 95.6, arm: 30.4, chest: 87, leg: 56.8, bf: 25.4 },
].map((r) => ({
  id: generateId("registro"),
  date: daysAgo(r.d),
  weight: r.w,
  measurements: {
    waist: r.waist,
    hip: r.hip,
    arm: r.arm,
    chest: r.chest,
    leg: r.leg,
    bodyFat: r.bf,
  },
}));

/* --------------------------- Historial de entreno ------------------------- */

/** Plantillas de sesión, con los ejercicios curados (fichas completas). */
const SESSION_TEMPLATES: {
  name: string;
  exercises: { id: string; sets: number; reps: string; weight: number }[];
}[] = [
  {
    name: "Empuje · Pecho y hombro",
    exercises: [
      { id: "press-banca", sets: 4, reps: "8-12", weight: 32 },
      { id: "press-inclinado-mancuernas", sets: 4, reps: "10-12", weight: 12 },
      { id: "press-militar", sets: 3, reps: "8-10", weight: 20 },
      { id: "elevaciones-laterales", sets: 3, reps: "12-15", weight: 6 },
      { id: "extension-polea", sets: 3, reps: "12-15", weight: 18 },
    ],
  },
  {
    name: "Tirón · Espalda y bíceps",
    exercises: [
      { id: "jalon-pecho", sets: 4, reps: "10-12", weight: 40 },
      { id: "remo-barra", sets: 4, reps: "8-10", weight: 35 },
      { id: "remo-polea-baja", sets: 3, reps: "12", weight: 38 },
      { id: "curl-barra", sets: 3, reps: "10-12", weight: 18 },
      { id: "curl-martillo", sets: 3, reps: "12", weight: 8 },
    ],
  },
  {
    name: "Pierna completa",
    exercises: [
      { id: "sentadilla-barra", sets: 4, reps: "8-10", weight: 45 },
      { id: "prensa", sets: 4, reps: "12", weight: 110 },
      { id: "curl-femoral", sets: 3, reps: "12", weight: 30 },
      { id: "hip-thrust", sets: 4, reps: "10-12", weight: 60 },
      { id: "elevacion-talones-maquina", sets: 4, reps: "15", weight: 55 },
    ],
  },
  {
    name: "Glúteo y core",
    exercises: [
      { id: "peso-muerto-rumano", sets: 4, reps: "10", weight: 40 },
      { id: "abduccion-cadera", sets: 3, reps: "15", weight: 35 },
      { id: "extension-cadera-maquina", sets: 3, reps: "12", weight: 30 },
      { id: "plancha", sets: 3, reps: "45 s", weight: 0 },
      { id: "crunch-polea", sets: 3, reps: "15", weight: 22 },
    ],
  },
];

/**
 * Días con entreno en las últimas 12 semanas.
 *
 * Incluye una racha viva en los últimos días y algún hueco antiguo: una
 * asistencia perfecta durante tres meses no se la cree nadie, y además dejaría
 * sin probar cómo se ve una racha rota.
 */
const TRAINED_DAYS = [
  1, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 22, 24, 26, 28, 29, 31, 33, 35,
  36, 38, 40, 43, 45, 47, 50, 52, 54, 57, 59, 61, 64, 66, 68, 71, 73, 75, 78,
];

export function buildDemoSessions(): WorkoutSession[] {
  return TRAINED_DAYS.map((day, i) => {
    const template = SESSION_TEMPLATES[i % SESSION_TEMPLATES.length];
    // Las cargas suben un poco con el tiempo: los días más lejanos pesan menos.
    const progression = 1 - Math.min(0.18, day * 0.0022);
    return {
      id: generateId("sesion"),
      routineName: template.name,
      date: isoDaysAgo(day),
      completed: true,
      exercises: template.exercises.map((e) => ({
        exerciseId: e.id,
        // El nombre se resuelve del catálogo: guardarlo como id haría que los
        // récords personales mostrasen "hip-thrust" en vez del nombre real.
        name: getExercise(e.id)?.name ?? e.id,
        targetSets: e.sets,
        targetReps: e.reps,
        notes: "",
        sets: Array.from({ length: e.sets }, () => ({
          done: true,
          weight: e.weight
            ? String(Math.round(e.weight * progression * 2) / 2)
            : "",
          reps: e.reps.split("-")[0],
        })),
      })),
    };
  }).reverse();
}

/* ------------------------------ Rutina propia ----------------------------- */

export const DEMO_ROUTINE: CustomRoutine = {
  id: generateId("rutina"),
  name: "Mi rutina de fuerza",
  muscles: ["pierna", "gluteo", "espalda"],
  createdAt: isoDaysAgo(30, 12),
  exercises: [
    { exerciseId: "sentadilla-barra", sets: 4, reps: "8-10" },
    { exerciseId: "hip-thrust", sets: 4, reps: "10-12" },
    { exerciseId: "jalon-pecho", sets: 4, reps: "10-12" },
    { exerciseId: "remo-polea-baja", sets: 3, reps: "12" },
    { exerciseId: "plancha", sets: 3, reps: "45 s" },
  ],
};

/** Entrenamiento planificado para hoy, para que la Home no salga vacía. */
const TODAY_PLAN = {
  date: todayKey(),
  exercises: [
    { exerciseId: "press-banca", sets: 4, reps: "8-12" },
    { exerciseId: "press-militar", sets: 3, reps: "8-10" },
    { exerciseId: "elevaciones-laterales", sets: 3, reps: "12-15" },
    { exerciseId: "extension-polea", sets: 3, reps: "12-15" },
  ],
};

/* -------------------------------- Favoritos ------------------------------- */

const DEMO_FAVORITES = [
  "hip-thrust",
  "sentadilla-barra",
  "jalon-pecho",
  "curl-martillo",
];

/* --------------------------------- Avisos --------------------------------- */

function demoNotifications(): AppNotification[] {
  const items = [
    {
      title: "Nuevo horario los sábados",
      body: "A partir de este mes abrimos de 8:00 a 14:00. El resto de días no cambia.",
      kind: "horario" as const,
    },
    {
      title: "Clase de movilidad gratuita",
      body: "Jueves a las 19:00 con Valeria. Plazas limitadas, apúntate en recepción.",
      kind: "promocion" as const,
    },
    {
      title: "Mantenimiento de las cintas",
      body: "El martes por la mañana dos cintas estarán fuera de servicio.",
      kind: "aviso" as const,
    },
  ];
  return items.map((n, i) => ({
    ...createNotification({ ...n, published: true }),
    createdAt: isoDaysAgo(i * 4 + 1, 10),
  }));
}

/* --------------------------------- Siembra -------------------------------- */

/**
 * Deja el almacenamiento con un socio de demostración listo para recorrer toda
 * la aplicación. Idempotente: solo actúa la primera vez.
 */
export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(STORAGE_KEYS.demoSeeded)) return;

  const sessions = buildDemoSessions();

  saveToStorage(STORAGE_KEYS.profile, DEMO_PROFILE);
  saveToStorage(STORAGE_KEYS.progress, DEMO_PROGRESS);
  saveToStorage(STORAGE_KEYS.workoutSessions, sessions);
  saveToStorage(STORAGE_KEYS.customRoutines, [DEMO_ROUTINE]);
  saveToStorage(STORAGE_KEYS.todayRoutine, TODAY_PLAN);
  saveToStorage(STORAGE_KEYS.favorites, DEMO_FAVORITES);
  saveToStorage(STORAGE_KEYS.notifications, demoNotifications());

  // Plan nutricional ya calculado, con un "antes" para que se vea la
  // comparación de macros sin tener que recalcular a mano.
  const current = calculateNutrition(DEMO_PROFILE);
  const previous = calculateNutrition({ ...DEMO_PROFILE, weight: 68.4 });
  const plan: NutritionPlan = {
    current,
    previous: {
      calories: previous.calories,
      protein: previous.protein,
      carbs: previous.carbs,
      fats: previous.fats,
    },
    calculatedAt: isoDaysAgo(21, 9),
    weightAtCalculation: 66.1,
  };
  saveToStorage(STORAGE_KEYS.nutritionPlan, plan);
  saveToStorage(STORAGE_KEYS.nutrition, current);

  window.localStorage.setItem(STORAGE_KEYS.demoSeeded, "1");
}

/** Vuelve a dejar la demostración como recién instalada. */
export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.demoSeeded);
  window.localStorage.removeItem(STORAGE_KEYS.activeWorkout);
  seedDemoData();
}

