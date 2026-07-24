"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Beef, Calculator, Droplets, Flame, HeartPulse, Wheat } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DietCard } from "@/components/DietCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type {
  ActivityLevel,
  Goal,
  NutritionResult,
  Sex,
  UserProfile,
} from "@/lib/types";
import { ACTIVITY_FACTORS, GOAL_ADJUSTMENTS } from "@/utils/calories";
import { calculateNutrition } from "@/utils/macros";
import { DIETS } from "@/data/diets";

const DEFAULT_FORM = {
  age: "25",
  sex: "hombre" as Sex,
  weight: "75",
  height: "175",
  activity: "moderado" as ActivityLevel,
  goal: "ganar-musculo" as Goal,
  targetWeight: "",
};

export default function NutricionPage() {
  const [profile, setProfile, profileHydrated] =
    useLocalStorage<UserProfile | null>(STORAGE_KEYS.profile, null);
  const [nutrition, setNutrition] = useLocalStorage<NutritionResult | null>(
    STORAGE_KEYS.nutrition,
    null
  );
  const [form, setForm] = useState(DEFAULT_FORM);

  // Autollenado: si ya existe perfil, partimos de sus datos en vez de pedirlos
  // otra vez. Solo se ejecuta al hidratar para no pisar lo que el usuario teclea.
  useEffect(() => {
    if (!profileHydrated || !profile) return;
    setForm({
      age: String(profile.age),
      sex: profile.sex,
      weight: String(profile.weight),
      height: String(profile.height),
      activity: profile.activity ?? "moderado",
      goal: profile.goal,
      targetWeight: profile.targetWeight ? String(profile.targetWeight) : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileHydrated]);

  const set = (field: keyof typeof DEFAULT_FORM) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const valid =
    Number(form.age) >= 14 &&
    Number(form.age) <= 100 &&
    Number(form.weight) >= 30 &&
    Number(form.weight) <= 300 &&
    Number(form.height) >= 120 &&
    Number(form.height) <= 230;

  const calculate = () => {
    if (!valid) return;
    // Merge sobre el perfil existente: conservamos identidad de socio
    // (nombre, foto, nº de socio, nivel, plan…) y solo actualizamos los
    // datos físicos y el objetivo que edita esta calculadora.
    const updated: UserProfile = {
      ...profile,
      age: Number(form.age),
      sex: form.sex,
      weight: Number(form.weight),
      height: Number(form.height),
      activity: form.activity,
      goal: form.goal,
      targetWeight: form.targetWeight
        ? Number(form.targetWeight)
        : profile?.targetWeight,
    };
    setProfile(updated);
    setNutrition(calculateNutrition(updated));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Nutrición"
        title="Calculadora y dietas"
        description="Calcula tus calorías y macronutrientes según tu cuerpo y objetivo, y elige una de las 10 dietas completas."
      />

      {/* ----------------------------- Calculadora ----------------------------- */}
      <section aria-label="Calculadora corporal" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-5 text-primary" />
              Calculadora corporal
            </CardTitle>
            <CardDescription>
              Fórmula Mifflin-St Jeor, el estándar para estimar tu metabolismo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  min={14}
                  max={100}
                  value={form.age}
                  onChange={(e) => set("age")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sexo</Label>
                <Select value={form.sex} onValueChange={(v) => set("sex")(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hombre">Hombre</SelectItem>
                    <SelectItem value="mujer">Mujer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={30}
                  max={300}
                  value={form.weight}
                  onChange={(e) => set("weight")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min={120}
                  max={230}
                  value={form.height}
                  onChange={(e) => set("height")(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nivel de actividad</Label>
              <Select
                value={form.activity}
                onValueChange={(v) => set("activity")(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_FACTORS).map(([id, item]) => (
                    <SelectItem key={id} value={id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Objetivo</Label>
                <Select value={form.goal} onValueChange={(v) => set("goal")(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GOAL_ADJUSTMENTS).map(([id, item]) => (
                      <SelectItem key={id} value={id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-weight">Peso objetivo (opcional)</Label>
                <Input
                  id="target-weight"
                  type="number"
                  min={30}
                  max={300}
                  placeholder="kg"
                  value={form.targetWeight}
                  onChange={(e) => set("targetWeight")(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} disabled={!valid} className="w-full">
              Calcular mi plan
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card className={nutrition ? "border-primary/40" : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="size-5 text-primary" />
              Tus resultados
            </CardTitle>
            <CardDescription>
              {nutrition
                ? "Guardados en tu dispositivo y visibles en el Dashboard."
                : "Completa el formulario y pulsa «Calcular mi plan»."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nutrition ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xl font-bold tabular-nums">
                      {nutrition.bmi}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      IMC · {nutrition.bmiCategory}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xl font-bold tabular-nums">
                      {nutrition.bmr.toLocaleString("es")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Metabolismo basal
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xl font-bold tabular-nums">
                      {nutrition.maintenanceCalories.toLocaleString("es")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mantenimiento (kcal)
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="flex items-center justify-center gap-2 text-3xl font-extrabold text-primary tabular-nums">
                    <Flame className="size-6" />
                    {nutrition.calories.toLocaleString("es")} kcal
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Calorías objetivo diarias
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Beef, label: "Proteína", value: nutrition.protein },
                    { icon: Wheat, label: "Carbohidratos", value: nutrition.carbs },
                    { icon: Droplets, label: "Grasas", value: nutrition.fats },
                  ].map((macro) => (
                    <div
                      key={macro.label}
                      className="rounded-lg border p-3 text-center"
                    >
                      <macro.icon className="mx-auto size-5 text-primary" />
                      <p className="mt-1 text-lg font-bold tabular-nums">
                        {macro.value} g
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {macro.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <Calculator className="size-8" />
                <p className="max-w-56 text-sm">
                  Aquí verás tu IMC, metabolismo basal, calorías y
                  macronutrientes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------- Dietas -------------------------------- */}
      <section aria-label="Sistema de dietas" className="mt-14">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Sistema de dietas
          </h2>
          <p className="mt-1 text-muted-foreground">
            10 planes completos con comidas, ingredientes y preparación. Toca
            una dieta para ver el día completo.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIETS.map((diet, index) => (
            <DietCard key={diet.id} diet={diet} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
