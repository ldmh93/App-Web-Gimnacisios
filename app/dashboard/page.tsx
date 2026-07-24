"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Beef, Calculator, Flame, Scale, UserPlus } from "lucide-react";
import { StatTile } from "@/components/StatTile";
import { TodayWorkoutCard } from "@/components/TodayWorkoutCard";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTodaySession } from "@/hooks/useTodaySession";
import { STORAGE_KEYS } from "@/lib/storage";
import type {
  NutritionResult,
  ProgressEntry,
  UserProfile,
} from "@/lib/types";
import { GOAL_ADJUSTMENTS } from "@/utils/calories";
import { getPredefinedRoutine, recommendRoutine } from "@/data/routines";

/** Valores de ejemplo mientras el usuario no calcula su plan en Nutrición. */
const DEFAULTS = {
  weight: 75,
  goalLabel: "Ganar músculo",
  calories: 2500,
  protein: 160,
};

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
  const router = useRouter();
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
  const { plan, session, startSession } = useTodaySession();

  const suggested = useMemo(() => todaysWorkout(profile), [profile]);

  // El plan armado en la biblioteca tiene prioridad sobre la sugerencia del día.
  const workout =
    plan.length > 0
      ? {
          name: "Mi rutina de hoy",
          source: "Armado por ti en la biblioteca",
          exercises: plan,
        }
      : suggested
        ? {
            name: suggested.name,
            source: `Sugerencia · ${suggested.routineName}`,
            exercises: suggested.exercises,
          }
        : null;

  const inProgress = Boolean(session && !session.completed);

  // Una sola acción: si hay sesión en curso la continúa; si no, la crea desde
  // el entrenamiento de hoy. En ambos casos se entrena en /rutinas.
  const handleTrain = () => {
    if (!inProgress && workout) {
      startSession(workout.name, workout.exercises);
    }
    router.push("/rutinas");
  };

  const latestWeight =
    progressEntries.length > 0
      ? progressEntries[progressEntries.length - 1].weight
      : profile?.weight ?? DEFAULTS.weight;
  const goalLabel = profile
    ? GOAL_ADJUSTMENTS[profile.goal].label
    : DEFAULTS.goalLabel;
  const calories = nutrition?.calories ?? DEFAULTS.calories;
  const protein = nutrition?.protein ?? DEFAULTS.protein;

  const today = new Date().toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Saludo compacto o invitación a crear perfil (un solo aviso, sin apilar) */}
      {profile ? (
        <div className="mb-6 flex items-center gap-3">
          <UserAvatar
            name={profile.name}
            avatar={profile.avatar}
            className="size-12 text-base"
          />
          <div className="min-w-0">
            <p className="text-xs capitalize text-muted-foreground">{today}</p>
            <h1 className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">
              Hola, {profile.name?.split(/\s+/)[0]} 👋
            </h1>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Crea tu perfil para personalizar tu plan, tus macros y tu rutina.
              </p>
              <Button asChild size="sm" className="glow-primary-soft">
                <Link href="/bienvenido">
                  <UserPlus className="size-4" />
                  Crear mi perfil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Entrenamiento de hoy: la acción principal de la pantalla */}
      {workout && (
        <TodayWorkoutCard
          name={workout.name}
          source={workout.source}
          exercises={workout.exercises}
          session={session}
          onTrain={handleTrain}
        />
      )}

      {/* Resumen nutricional: 3 datos glanceables + enlace al plan completo */}
      <section aria-label="Resumen nutricional" className="mt-6">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Tu plan de hoy
          </h2>
          <Link
            href="/nutricion"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Ver plan completo
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatTile
            label="Calorías"
            value={calories.toLocaleString("es")}
            unit="kcal"
            icon={Flame}
            accent
            delay={0}
          />
          <StatTile
            label="Proteína"
            value={protein}
            unit="g"
            icon={Beef}
            delay={0.05}
          />
          <StatTile
            label="Peso"
            value={latestWeight}
            unit="kg"
            icon={Scale}
            delay={0.1}
          />
        </div>

        {!nutrition ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
          >
            <p className="text-muted-foreground">
              Valores de ejemplo. Calcula tu plan personalizado en 1 minuto.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/nutricion">
                <Calculator className="size-4" />
                Calcular mis macros
              </Link>
            </Button>
          </motion.div>
        ) : (
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Objetivo: {goalLabel}
          </p>
        )}
      </section>
    </div>
  );
}
