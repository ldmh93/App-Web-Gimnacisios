"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  Dumbbell,
  Flame,
  Ruler,
  Target,
  UserPlus,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MemberCard } from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { NutritionResult, UserProfile } from "@/lib/types";
import { GOAL_ADJUSTMENTS } from "@/utils/calories";
import { recommendRoutine } from "@/data/routines";

export default function CarnetPage() {
  const [profile, , hydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );
  const [nutrition] = useLocalStorage<NutritionResult | null>(
    STORAGE_KEYS.nutrition,
    null
  );

  if (!hydrated) return null;

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <BadgeCheck className="mx-auto mb-4 size-12 text-primary" />
        <h1 className="text-2xl font-bold">Aún no tienes carnet</h1>
        <p className="mt-2 text-muted-foreground">
          Crea tu perfil de socio y generamos tu carnet digital al instante.
        </p>
        <Button asChild size="lg" className="glow-primary-soft mt-6">
          <Link href="/bienvenido">
            <UserPlus className="size-5" />
            Crear mi perfil
          </Link>
        </Button>
      </div>
    );
  }

  const routine = recommendRoutine({
    level: profile.level,
    goal: profile.goal,
    daysPerWeek: profile.daysPerWeek,
  });

  const stats = [
    {
      icon: Target,
      label: "Objetivo",
      value: GOAL_ADJUSTMENTS[profile.goal].label,
    },
    {
      icon: Dumbbell,
      label: "Nivel",
      value: profile.level ?? "—",
    },
    {
      icon: CalendarClock,
      label: "Frecuencia",
      value: profile.daysPerWeek ? `${profile.daysPerWeek} días/sem` : "—",
    },
    {
      icon: Ruler,
      label: "Peso · Altura",
      value: `${profile.weight} kg · ${profile.height} cm`,
    },
    {
      icon: Flame,
      label: "Calorías objetivo",
      value: nutrition ? `${nutrition.calories.toLocaleString("es")} kcal` : "—",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Socio"
        title="Mi carnet"
        description="Tu credencial digital de MAYCOL GYM. Guardada en tu dispositivo."
      />

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <MemberCard profile={profile} />

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-start gap-3 p-4">
                  <s.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="truncate font-semibold capitalize">
                      {s.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/40">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-primary">
                Rutina recomendada para ti
              </p>
              <p className="mt-1 font-bold">{routine.name}</p>
              <p className="text-sm text-muted-foreground">{routine.goal}</p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/rutinas#predefinidas">
                  <Dumbbell className="size-4" />
                  Ver la rutina
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href="/bienvenido">Editar mis datos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
