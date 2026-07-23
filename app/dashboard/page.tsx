"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Beef,
  Calculator,
  Dumbbell,
  Flame,
  Droplets,
  Scale,
  Target,
  Wheat,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MacroCard } from "@/components/MacroCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  EMPTY_TODAY_ROUTINE,
  todayKey,
  type TodayRoutine,
} from "@/lib/workout";
import type {
  NutritionResult,
  ProgressEntry,
  UserProfile,
} from "@/lib/types";
import { GOAL_ADJUSTMENTS } from "@/utils/calories";
import { getExercise } from "@/data/exercises";
import { getPredefinedRoutine, recommendRoutine } from "@/data/routines";
import { UserAvatar } from "@/components/UserAvatar";
import { BadgeCheck, UserPlus } from "lucide-react";

/** Valores de ejemplo mientras el usuario no calcula su plan en Nutrición. */
const DEFAULTS = {
  weight: 75,
  goalLabel: "Ganar músculo",
  calories: 2500,
  protein: 160,
  carbs: 280,
  fats: 70,
};

interface DashboardChecks {
  date: string;
  done: Record<string, boolean>;
}

/**
 * Rotación simple del día según la rutina recomendada para el socio.
 * Si no hay perfil, cae en Push-Pull-Legs.
 */
function todaysWorkout(profile: UserProfile | null) {
  const routine = profile
    ? recommendRoutine({
        level: profile.level,
        goal: profile.goal,
        daysPerWeek: profile.daysPerWeek,
      })
    : getPredefinedRoutine("push-pull-legs");
  if (!routine) return null;
  const weekday = new Date().getDay(); // 0=domingo
  const index = weekday === 0 ? 0 : (weekday - 1) % routine.days.length;
  return { ...routine.days[index], routineName: routine.name };
}

export default function DashboardPage() {
  const [profile] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );
  const [nutrition] = useLocalStorage<NutritionResult | null>(
    STORAGE_KEYS.nutrition,
    null
  );
  const [progressEntries] = useLocalStorage<ProgressEntry[]>(
    STORAGE_KEYS.progress,
    []
  );
  const [checks, setChecks] = useLocalStorage<DashboardChecks>(
    STORAGE_KEYS.dashboardChecks,
    { date: todayKey(), done: {} }
  );
  const [todayRoutine] = useLocalStorage<TodayRoutine>(
    STORAGE_KEYS.todayRoutine,
    EMPTY_TODAY_ROUTINE
  );

  const suggested = useMemo(() => todaysWorkout(profile), [profile]);

  // Si el usuario armó su rutina desde la biblioteca, tiene prioridad
  // sobre la sugerencia automática del día.
  const customToday =
    todayRoutine.date === todayKey() && todayRoutine.exercises.length > 0;
  const workout = customToday
    ? { name: "Mi rutina de hoy", exercises: todayRoutine.exercises }
    : suggested;

  const latestWeight =
    progressEntries.length > 0
      ? progressEntries[progressEntries.length - 1].weight
      : profile?.weight ?? DEFAULTS.weight;

  const goalLabel = profile
    ? GOAL_ADJUSTMENTS[profile.goal].label
    : DEFAULTS.goalLabel;

  const macros = nutrition ?? {
    calories: DEFAULTS.calories,
    protein: DEFAULTS.protein,
    carbs: DEFAULTS.carbs,
    fats: DEFAULTS.fats,
  };

  // El checklist se reinicia automáticamente cada día.
  const doneToday = checks.date === todayKey() ? checks.done : {};
  const totalExercises = workout?.exercises.length ?? 0;
  const completed = workout
    ? workout.exercises.filter((e) => doneToday[e.exerciseId]).length
    : 0;
  const percent = totalExercises > 0 ? (completed / totalExercises) * 100 : 0;

  const toggleExercise = (exerciseId: string, value: boolean) => {
    setChecks({
      date: todayKey(),
      done: { ...doneToday, [exerciseId]: value },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {profile ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={profile.name}
              avatar={profile.avatar}
              className="size-14 text-lg"
            />
            <div>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("es", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Hola, {profile.name?.split(/\s+/)[0]} 👋
              </h1>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/carnet">
              <BadgeCheck className="size-4" />
              Mi carnet de socio
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <PageHeader
            eyebrow="Dashboard"
            title="Tu centro de mando"
            description="Resumen corporal, objetivos nutricionales y el entrenamiento de hoy en un vistazo."
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
          >
            <p className="text-sm text-muted-foreground">
              Crea tu perfil de socio para personalizar tu plan, tus macros y tu
              rutina.
            </p>
            <Button asChild size="sm" className="glow-primary-soft">
              <Link href="/bienvenido">
                <UserPlus className="size-4" />
                Crear mi perfil
              </Link>
            </Button>
          </motion.div>
        </>
      )}

      {/* Resumen corporal */}
      <section aria-label="Resumen corporal">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MacroCard
            label="Peso actual"
            value={latestWeight}
            unit="kg"
            icon={Scale}
            hint={
              progressEntries.length > 0
                ? "Último registro en Progreso"
                : "Regístralo en Progreso"
            }
            delay={0}
          />
          <MacroCard
            label="Objetivo"
            value={goalLabel}
            icon={Target}
            hint={
              profile?.targetWeight
                ? `Meta: ${profile.targetWeight} kg`
                : "Defínelo en Nutrición"
            }
            delay={0.05}
          />
          <MacroCard
            label="Calorías diarias"
            value={macros.calories.toLocaleString("es")}
            unit="kcal"
            icon={Flame}
            accent
            delay={0.1}
          />
          <MacroCard
            label="Proteína"
            value={macros.protein}
            unit="g"
            icon={Beef}
            delay={0.15}
          />
          <MacroCard
            label="Carbohidratos"
            value={macros.carbs}
            unit="g"
            icon={Wheat}
            delay={0.2}
          />
          <MacroCard
            label="Grasas"
            value={macros.fats}
            unit="g"
            icon={Droplets}
            delay={0.25}
          />
        </div>

        {!nutrition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
          >
            <p className="text-muted-foreground">
              Estos son valores de ejemplo. Calcula tu plan personalizado en 1
              minuto.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/nutricion">
                <Calculator className="size-4" />
                Calcular mis macros
              </Link>
            </Button>
          </motion.div>
        )}
      </section>

      {/* Entrenamiento del día */}
      {workout && (
        <motion.section
          aria-label="Entrenamiento del día"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-10"
        >
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardDescription>
                    {customToday
                      ? "Entrenamiento de hoy · armado por ti en la biblioteca"
                      : suggested && "routineName" in suggested
                        ? `Entrenamiento de hoy · ${suggested.routineName}`
                        : "Entrenamiento de hoy · sugerencia AURA GYM"}
                  </CardDescription>
                  <CardTitle className="mt-1 text-xl uppercase tracking-wide">
                    {workout.name.replace("—", "·")}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="gap-1.5">
                  <Dumbbell className="size-3.5" />
                  {completed}/{totalExercises} ejercicios
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={percent} className="h-2.5" />
                <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-primary">
                  {Math.round(percent)}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {workout.exercises.map((item) => {
                  const exercise = getExercise(item.exerciseId);
                  if (!exercise) return null;
                  const checked = Boolean(doneToday[item.exerciseId]);
                  return (
                    <li key={item.exerciseId}>
                      <label className="flex cursor-pointer items-center gap-4 py-3 transition-colors hover:bg-muted/50">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) =>
                            toggleExercise(item.exerciseId, v === true)
                          }
                          className="size-5"
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={
                              checked
                                ? "font-medium text-muted-foreground line-through"
                                : "font-medium"
                            }
                          >
                            {exercise.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.sets} × {item.reps}
                          </p>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/rutinas">
                    <Dumbbell className="size-4" />
                    Entrenar con registro completo
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/rutinas#predefinidas">Ver otras rutinas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </div>
  );
}
