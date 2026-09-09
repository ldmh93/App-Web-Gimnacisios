"use client";

import { motion } from "framer-motion";
import { ArrowRight, Info, PlusCircle, RefreshCw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  adjustmentSummary,
  GOAL_META,
  macroDelta,
  RECALC_WEIGHT_DELTA,
  type NutritionPlan,
} from "@/lib/nutritionPlan";
import type { MacroTargets, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const MACROS: {
  key: keyof MacroTargets;
  emoji: string;
  label: string;
  unit: string;
}[] = [
  { key: "calories", emoji: "🔥", label: "Calorías", unit: "kcal" },
  { key: "protein", emoji: "🥩", label: "Proteína", unit: "g" },
  { key: "carbs", emoji: "🍚", label: "Carbohidratos", unit: "g" },
  { key: "fats", emoji: "🥑", label: "Grasas", unit: "g" },
];

interface ObjectiveSummaryProps {
  profile: UserProfile;
  plan: NutritionPlan;
  /** Peso más reciente registrado, para detectar si conviene recalcular. */
  latestWeight: number;
  onRegister: () => void;
  onUpdate: () => void;
}

/**
 * Resumen del objetivo: la pantalla a la que vuelve el socio cada vez.
 *
 * Si el peso registrado se ha alejado del que se usó para calcular, se ofrece
 * recalcular: unos macros fijados hace tres meses y diez kilos dejan de servir,
 * y nadie se acuerda de revisarlos por su cuenta.
 */
export function ObjectiveSummary({
  profile,
  plan,
  latestWeight,
  onRegister,
  onUpdate,
}: ObjectiveSummaryProps) {
  const meta = GOAL_META[profile.goal];
  const drift = Math.abs(latestWeight - plan.weightAtCalculation);
  const suggestRecalc = drift >= RECALC_WEIGHT_DELTA;
  const delta = plan.previous ? macroDelta(plan.previous, plan.current) : null;

  return (
    <motion.section
      aria-label="Tu objetivo"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <Card className="glow-primary-soft border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {meta.emoji}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Tu objetivo
                </p>
                <h2 className="text-xl font-extrabold leading-tight">
                  {meta.label}
                </h2>
              </div>
            </div>
            <Target className="size-5 shrink-0 text-primary" />
          </div>

          {/* Pesos */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span>
              <span className="text-muted-foreground">Peso actual </span>
              <strong className="tabular-nums">{latestWeight} kg</strong>
            </span>
            {profile.targetWeight ? (
              <span className="flex items-center gap-1.5">
                <ArrowRight className="size-3.5 text-primary" />
                <span className="text-muted-foreground">Objetivo </span>
                <strong className="tabular-nums">
                  {profile.targetWeight} kg
                </strong>
              </span>
            ) : null}
          </div>

          {/* Macros */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MACROS.map((m) => (
              <div
                key={m.key}
                className="rounded-2xl border border-border/60 bg-background/40 p-3"
              >
                <span className="text-xl" aria-hidden>
                  {m.emoji}
                </span>
                <p className="mt-0.5 text-xl font-extrabold tabular-nums">
                  {plan.current[m.key].toLocaleString("es")}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    {m.unit}
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">{m.label}</p>
                {delta && delta[m.key] !== 0 && (
                  <p
                    className={cn(
                      "text-[11px] font-semibold tabular-nums",
                      delta[m.key] > 0 ? "text-emerald-500" : "text-amber-500"
                    )}
                  >
                    {delta[m.key] > 0 ? "+" : ""}
                    {delta[m.key]} vs. antes
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {adjustmentSummary(profile)} · calculado el{" "}
            {new Date(plan.calculatedAt).toLocaleDateString("es", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Aviso de recálculo */}
          {suggestRecalc && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3"
            >
              <p className="text-sm font-semibold">
                ¿Quieres actualizar tus objetivos nutricionales?
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Tu peso ha cambiado {drift.toFixed(1)} kg desde el último
                cálculo, así que estos macros se han quedado cortos o largos.
              </p>
              <Button size="sm" onClick={onUpdate} className="mt-2.5">
                <RefreshCw className="size-4" />
                Recalcular con mis datos actuales
              </Button>
            </motion.div>
          )}

          {/* Acciones */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={onRegister}
              className="h-12 flex-1 font-semibold"
              size="lg"
            >
              <PlusCircle className="size-5" />
              Registrar mi progreso
            </Button>
            <Button
              onClick={onUpdate}
              variant="outline"
              className="h-12 sm:w-auto"
              size="lg"
            >
              <RefreshCw className="size-4" />
              Actualizar mis objetivos
            </Button>
          </div>

          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3 shrink-0" />
            Estimaciones orientativas, no un diagnóstico. Ajústalas según tu
            evolución y consulta con un profesional si tienes alguna condición
            de salud.
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
