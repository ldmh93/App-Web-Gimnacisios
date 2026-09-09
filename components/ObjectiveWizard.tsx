"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GOAL_META, recommendation } from "@/lib/nutritionPlan";
import type {
  ActivityLevel,
  Goal,
  GoalPace,
  Sex,
  TrainingType,
  UserProfile,
} from "@/lib/types";
import { ACTIVITY_FACTORS, PACE_FACTORS } from "@/utils/calories";
import { calculateNutrition } from "@/utils/macros";
import { cn } from "@/lib/utils";

const STEPS = [
  "Tus datos",
  "Tu cuerpo",
  "Actividad",
  "Objetivo",
  "Tus macros",
  "Recomendación",
];

const TRAINING_TYPES: { id: TrainingType; label: string; emoji: string }[] = [
  { id: "fuerza", label: "Fuerza / pesas", emoji: "🏋️" },
  { id: "cardio", label: "Cardio", emoji: "🏃" },
  { id: "mixto", label: "Mixto", emoji: "🔀" },
  { id: "otro", label: "Otro", emoji: "🤸" },
];

/** Opción grande y tocable, en vez de un desplegable. */
function Choice({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-[56px] w-full rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.98]",
        active
          ? "border-primary bg-primary/10 ring-2 ring-primary/40"
          : "border-border bg-card/50 hover:border-primary/50",
        className
      )}
    >
      {children}
    </button>
  );
}

interface ObjectiveWizardProps {
  /** Perfil de partida, si ya existe. */
  profile: UserProfile | null;
  onFinish: (profile: UserProfile) => void;
  onCancel?: () => void;
}

/**
 * Evaluación inicial en seis pasos.
 *
 * Se pregunta poco en cada pantalla a propósito: un formulario largo en el
 * móvil se abandona. Todos los cálculos reutilizan utils/calories y
 * utils/macros, que ya estaban en el proyecto y son la misma fuente que usa
 * la pestaña Nutrición: así las cifras no pueden discrepar entre pantallas.
 */
export function ObjectiveWizard({
  profile,
  onFinish,
  onCancel,
}: ObjectiveWizardProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<UserProfile>(
    profile ?? {
      age: 28,
      sex: "hombre",
      weight: 75,
      height: 175,
      activity: "moderado",
      goal: "perder-grasa",
      pace: "moderado",
      trainingType: "fuerza",
      sessionMinutes: 60,
      daysPerWeek: 4,
    }
  );

  const set = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const result = useMemo(() => calculateNutrition(form), [form]);
  const advice = useMemo(() => recommendation(form), [form]);

  const numeric = (v: string) => Number(v.replace(",", ".")) || 0;
  const canContinue =
    step !== 0 || (form.age > 0 && form.age < 120);

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Card className="overflow-hidden">
      {/* Progreso del asistente */}
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Paso {step + 1} de {STEPS.length}
          </p>
          <p className="text-sm font-medium">{STEPS[step]}</p>
        </div>
        <div className="mt-2 flex gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {/* ------------------------- 1. Datos ------------------------- */}
            {step === 0 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="w-edad">Edad</Label>
                    <Input
                      id="w-edad"
                      type="number"
                      inputMode="numeric"
                      value={form.age || ""}
                      onChange={(e) => set("age", numeric(e.target.value))}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Sexo</Label>
                    <div className="flex gap-2">
                      {(["hombre", "mujer"] as Sex[]).map((s) => (
                        <Choice
                          key={s}
                          active={form.sex === s}
                          onClick={() => set("sex", s)}
                          className="min-h-[48px] capitalize"
                        >
                          {s}
                        </Choice>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  La edad y el sexo entran en la fórmula del metabolismo basal.
                  No se comparten con nadie: todo queda en tu dispositivo.
                </p>
              </>
            )}

            {/* ------------------------ 2. Cuerpo ------------------------- */}
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="w-peso">Peso actual (kg)</Label>
                  <Input
                    id="w-peso"
                    type="number"
                    inputMode="decimal"
                    value={form.weight || ""}
                    onChange={(e) => set("weight", numeric(e.target.value))}
                    className="h-12"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="w-altura">Estatura (cm)</Label>
                  <Input
                    id="w-altura"
                    type="number"
                    inputMode="numeric"
                    value={form.height || ""}
                    onChange={(e) => set("height", numeric(e.target.value))}
                    className="h-12"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="w-objetivo-peso">
                    Peso objetivo (kg) · opcional
                  </Label>
                  <Input
                    id="w-objetivo-peso"
                    type="number"
                    inputMode="decimal"
                    value={form.targetWeight ?? ""}
                    onChange={(e) =>
                      set(
                        "targetWeight",
                        e.target.value ? numeric(e.target.value) : undefined
                      )
                    }
                    placeholder="Déjalo vacío si aún no lo tienes claro"
                    className="h-12"
                  />
                </div>
              </div>
            )}

            {/* ----------------------- 3. Actividad ----------------------- */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Nivel de actividad</Label>
                  {(Object.keys(ACTIVITY_FACTORS) as ActivityLevel[]).map(
                    (a) => (
                      <Choice
                        key={a}
                        active={form.activity === a}
                        onClick={() => set("activity", a)}
                      >
                        <span className="text-sm font-medium">
                          {ACTIVITY_FACTORS[a].label}
                        </span>
                      </Choice>
                    )
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="w-dias">Días que entrenas por semana</Label>
                    <Input
                      id="w-dias"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={7}
                      value={form.daysPerWeek ?? ""}
                      onChange={(e) =>
                        set("daysPerWeek", numeric(e.target.value))
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="w-min">Minutos por sesión</Label>
                    <Input
                      id="w-min"
                      type="number"
                      inputMode="numeric"
                      value={form.sessionMinutes ?? ""}
                      onChange={(e) =>
                        set("sessionMinutes", numeric(e.target.value))
                      }
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de entrenamiento</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRAINING_TYPES.map((t) => (
                      <Choice
                        key={t.id}
                        active={form.trainingType === t.id}
                        onClick={() => set("trainingType", t.id)}
                      >
                        <span className="text-sm font-medium">
                          <span aria-hidden>{t.emoji}</span> {t.label}
                        </span>
                      </Choice>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ------------------------ 4. Objetivo ----------------------- */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>¿Cuál es tu objetivo principal?</Label>
                  {(Object.keys(GOAL_META) as Goal[]).map((g) => (
                    <Choice
                      key={g}
                      active={form.goal === g}
                      onClick={() => set("goal", g)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden>
                          {GOAL_META[g].emoji}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">
                            {GOAL_META[g].label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {GOAL_META[g].short}
                          </span>
                        </span>
                      </span>
                    </Choice>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <Label>¿A qué ritmo?</Label>
                  {(Object.keys(PACE_FACTORS) as GoalPace[]).map((p) => (
                    <Choice
                      key={p}
                      active={(form.pace ?? "moderado") === p}
                      onClick={() => set("pace", p)}
                    >
                      <span className="block text-sm font-semibold">
                        {PACE_FACTORS[p].label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {PACE_FACTORS[p].hint}
                      </span>
                    </Choice>
                  ))}
                  <p className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    Los tres ritmos son sostenibles. No ofrecemos uno agresivo
                    porque perder o ganar demasiado rápido cuesta músculo y
                    casi nadie lo mantiene.
                  </p>
                </div>
              </>
            )}

            {/* ------------------------- 5. Macros ------------------------ */}
            {step === 4 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Tu objetivo diario estimado
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "🔥", label: "Calorías", value: result.calories, unit: "kcal" },
                    { emoji: "🥩", label: "Proteína", value: result.protein, unit: "g" },
                    { emoji: "🍚", label: "Carbohidratos", value: result.carbs, unit: "g" },
                    { emoji: "🥑", label: "Grasas", value: result.fats, unit: "g" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-border/60 bg-card/50 p-4"
                    >
                      <span className="text-2xl" aria-hidden>
                        {m.emoji}
                      </span>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums">
                        {m.value.toLocaleString("es")}
                        <span className="ml-1 text-sm font-medium text-muted-foreground">
                          {m.unit}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm">
                  <p className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Metabolismo basal</span>
                    <span className="font-semibold tabular-nums">
                      {result.bmr.toLocaleString("es")} kcal
                    </span>
                  </p>
                  <p className="mt-1 flex justify-between gap-3">
                    <span className="text-muted-foreground">Mantenimiento</span>
                    <span className="font-semibold tabular-nums">
                      {result.maintenanceCalories.toLocaleString("es")} kcal
                    </span>
                  </p>
                  <p className="mt-1 flex justify-between gap-3">
                    <span className="text-muted-foreground">IMC</span>
                    <span className="font-semibold tabular-nums">
                      {result.bmi} · {result.bmiCategory}
                    </span>
                  </p>
                </div>
                <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  Son <strong>estimaciones orientativas</strong>, no un plan
                  médico. Ajústalas según cómo evoluciones, cómo te sientas y tus
                  preferencias; si tienes alguna condición de salud, consulta con
                  un profesional.
                </p>
              </>
            )}

            {/* ---------------------- 6. Recomendación -------------------- */}
            {step === 5 && (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>
                    {GOAL_META[form.goal].emoji}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {GOAL_META[form.goal].label}
                    </p>
                    <h3 className="text-lg font-extrabold leading-tight">
                      {advice.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{advice.body}</p>
                <ul className="space-y-2">
                  {advice.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  Orientación general basada en tus datos, no un diagnóstico ni
                  un tratamiento.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <div className="mt-6 flex items-center gap-3">
          {step > 0 ? (
            <Button variant="outline" onClick={back} className="h-12">
              <ArrowLeft className="size-4" />
              Atrás
            </Button>
          ) : (
            onCancel && (
              <Button variant="ghost" onClick={onCancel} className="h-12">
                Cancelar
              </Button>
            )
          )}

          {step < STEPS.length - 1 ? (
            <Button
              onClick={next}
              disabled={!canContinue}
              className="h-12 flex-1 font-semibold"
            >
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={() => onFinish(form)}
              className="glow-primary-soft h-12 flex-1 font-bold uppercase tracking-wide"
            >
              <Sparkles className="size-4" />
              Guardar mi objetivo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
