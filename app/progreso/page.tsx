"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  MoveDown,
  MoveRight,
  MoveUp,
  PlusCircle,
  Camera,
  Ruler,
  Scale,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProgressChart } from "@/components/ProgressChart";
import { TrainingSummary } from "@/components/TrainingSummary";
import { ObjectiveWizard } from "@/components/ObjectiveWizard";
import { ObjectiveSummary } from "@/components/ObjectiveSummary";
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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateId, STORAGE_KEYS } from "@/lib/storage";
import { compressImage, dataUrlSizeKb } from "@/lib/brand";
import { computeStats, personalRecords } from "@/lib/stats";
import type { NutritionPlan } from "@/lib/nutritionPlan";
import { calculateNutrition } from "@/utils/macros";
import type {
  Measurements,
  ProgressEntry,
  UserProfile,
  WorkoutSession,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type Metric = "weight" | keyof Measurements;

const METRICS: { id: Metric; label: string; unit: string }[] = [
  { id: "weight", label: "Peso", unit: "kg" },
  { id: "arm", label: "Brazo", unit: "cm" },
  { id: "chest", label: "Pecho", unit: "cm" },
  { id: "waist", label: "Cintura", unit: "cm" },
  { id: "hip", label: "Cadera", unit: "cm" },
  { id: "leg", label: "Pierna", unit: "cm" },
  { id: "bodyFat", label: "Grasa corporal", unit: "%" },
];

function metricValue(entry: ProgressEntry, metric: Metric): number | undefined {
  return metric === "weight" ? entry.weight : entry.measurements[metric];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
  });
}

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  weight: "",
  arm: "",
  chest: "",
  waist: "",
  hip: "",
  leg: "",
  bodyFat: "",
};

export default function ProgresoPage() {
  const [entries, setEntries] = useLocalStorage<ProgressEntry[]>(
    STORAGE_KEYS.progress,
    []
  );
  const [sessions] = useLocalStorage<WorkoutSession[]>(
    STORAGE_KEYS.workoutSessions,
    []
  );
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );
  const [plan, setPlan] = useLocalStorage<NutritionPlan | null>(
    STORAGE_KEYS.nutritionPlan,
    null
  );
  const [wizardOpen, setWizardOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  /** Las fotos se comprimen: el navegador solo guarda unos 5 MB en total. */
  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(null);
    try {
      const dataUrl = await compressImage(file, 900, 0.7);
      const kb = dataUrlSizeKb(dataUrl);
      if (kb > 600) {
        setPhotoError(
          `La foto ocupa ${kb} KB comprimida. Usa una más ligera para no llenar el almacenamiento.`
        );
        return;
      }
      setPhoto(dataUrl);
    } catch {
      setPhotoError("No se pudo procesar la foto.");
    }
  };

  const trainingStats = useMemo(() => computeStats(sessions), [sessions]);
  const records = useMemo(() => personalRecords(sessions), [sessions]);
  const [metric, setMetric] = useState<Metric>("weight");

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries]
  );

  const chartData = useMemo(
    () =>
      sorted
        .map((entry) => ({
          date: formatDate(entry.date),
          value: metricValue(entry, metric) ?? NaN,
        }))
        .filter((point) => !Number.isNaN(point.value)),
    [sorted, metric]
  );

  const selectedMetric = METRICS.find((m) => m.id === metric)!;

  const set = (field: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSave = form.date !== "" && Number(form.weight) > 0;

  const addEntry = () => {
    if (!canSave) return;
    const measurements: Measurements = {};
    if (form.arm) measurements.arm = Number(form.arm);
    if (form.chest) measurements.chest = Number(form.chest);
    if (form.waist) measurements.waist = Number(form.waist);
    if (form.hip) measurements.hip = Number(form.hip);
    if (form.leg) measurements.leg = Number(form.leg);
    if (form.bodyFat) measurements.bodyFat = Number(form.bodyFat);

    setEntries((prev) => [
      ...prev,
      {
        id: generateId("registro"),
        date: form.date,
        weight: Number(form.weight),
        measurements,
        ...(photo ? { photo } : {}),
      },
    ]);
    setForm({ ...EMPTY_FORM, date: form.date });
    setPhoto(null);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  /** Peso vigente: el último registrado, o el del perfil si aún no hay ninguno. */
  const latestWeight = last?.weight ?? profile?.weight ?? 0;

  /**
   * Guarda el perfil y calcula el plan, conservando el anterior para poder
   * enseñar la comparación "antes / ahora".
   */
  const saveObjective = (next: UserProfile) => {
    // El peso más reciente manda sobre el que se escribió en el asistente.
    const withWeight: UserProfile =
      last && last.weight > 0 ? { ...next, weight: last.weight } : next;
    setProfile(withWeight);
    setPlan((prev) => ({
      current: calculateNutrition(withWeight),
      previous: prev ? { ...prev.current } : undefined,
      calculatedAt: new Date().toISOString(),
      weightAtCalculation: withWeight.weight,
    }));
    setWizardOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Baja al formulario de registro. */
  const goToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Seguimiento"
        title="Progreso"
        description="Define tu objetivo, calcula tus macros y sigue tu evolución con datos, medidas y fotos."
      />

      {/* ------------------------ Objetivo y macros ------------------------- */}
      {wizardOpen || !profile || !plan ? (
        <div className="mb-8">
          {!wizardOpen && !plan && (
            <Card className="mb-4 border-primary/30 bg-primary/5">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                <div>
                  <p className="font-semibold">
                    Empieza definiendo tu objetivo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Seis pasos rápidos para calcular tus calorías y macros.
                  </p>
                </div>
                <Button
                  onClick={() => setWizardOpen(true)}
                  className="font-semibold"
                >
                  Empezar
                </Button>
              </CardContent>
            </Card>
          )}
          {wizardOpen && (
            <ObjectiveWizard
              profile={profile}
              onFinish={saveObjective}
              onCancel={plan ? () => setWizardOpen(false) : undefined}
            />
          )}
        </div>
      ) : (
        <ObjectiveSummary
          profile={profile}
          plan={plan}
          latestWeight={latestWeight}
          onRegister={goToRegister}
          onUpdate={() => setWizardOpen(true)}
        />
      )}

      <TrainingSummary stats={trainingStats} records={records} />

      <div ref={registerRef} className="grid scroll-mt-24 gap-6 lg:grid-cols-[380px_1fr]">
        {/* ------------------------------ Registro ----------------------------- */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="size-5 text-primary" />
              Nuevo registro
            </CardTitle>
            <CardDescription>
              El peso es obligatorio; las medidas, opcionales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  inputMode="decimal"
                  min={20}
                  max={300}
                  step="0.1"
                  placeholder="75.0"
                  value={form.weight}
                  onChange={(e) => set("weight")(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Ruler className="size-4 text-primary" />
                Medidas corporales (cm)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    ["arm", "Brazo"],
                    ["chest", "Pecho"],
                    ["waist", "Cintura"],
                    ["hip", "Cadera"],
                    ["leg", "Pierna"],
                  ] as const
                ).map(([field, label]) => (
                  <Input
                    key={field}
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min={0}
                    placeholder={label}
                    aria-label={label}
                    value={form[field]}
                    onChange={(e) => set(field)(e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-grasa">
                Porcentaje de grasa corporal · opcional
              </Label>
              <Input
                id="p-grasa"
                type="number"
                inputMode="decimal"
                step="0.1"
                min={0}
                max={70}
                placeholder="Solo si dispones del dato"
                value={form.bodyFat}
                onChange={(e) => set("bodyFat")(e.target.value)}
              />
            </div>

            {/* Foto de progreso: el espejo cuenta lo que la báscula calla */}
            <div className="space-y-2">
              <Label>Foto de progreso · opcional</Label>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => pickPhoto(e.target.files?.[0])}
              />
              {photo ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt="Foto de progreso seleccionada"
                    className="size-20 rounded-xl object-cover"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setPhoto(null)}>
                    Quitar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => photoInput.current?.click()}
                >
                  <Camera className="size-4" />
                  Añadir foto
                </Button>
              )}
              {photoError && (
                <p role="alert" className="text-xs text-destructive">
                  {photoError}
                </p>
              )}
            </div>

            <Button onClick={addEntry} disabled={!canSave} className="w-full">
              Guardar registro
            </Button>
          </CardContent>
        </Card>

        {/* ------------------------------ Gráfica ------------------------------ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="size-5 text-primary" />
                  Evolución
                </CardTitle>
                <Select
                  value={metric}
                  onValueChange={(v) => setMetric(v as Metric)}
                >
                  <SelectTrigger className="w-36" aria-label="Métrica">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METRICS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label} ({m.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ProgressChart data={chartData} unit={selectedMetric.unit} />
            </CardContent>
          </Card>

          {/* ---------------------------- Comparación ---------------------------- */}
          {first && last && first.id !== last.id && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="size-5 text-primary" />
                    Comparación de progreso
                  </CardTitle>
                  <CardDescription>
                    Del {formatDate(first.date)} al {formatDate(last.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {METRICS.map((m) => {
                      const start = metricValue(first, m.id);
                      const end = metricValue(last, m.id);
                      if (start === undefined || end === undefined) {
                        return (
                          <div
                            key={m.id}
                            className="rounded-lg border border-dashed p-3 text-center text-xs text-muted-foreground"
                          >
                            {m.label}
                            <br />
                            sin datos
                          </div>
                        );
                      }
                      const delta = Math.round((end - start) * 10) / 10;
                      const Icon =
                        delta > 0 ? MoveUp : delta < 0 ? MoveDown : MoveRight;
                      return (
                        <div
                          key={m.id}
                          className="rounded-lg bg-muted p-3 text-center"
                        >
                          <p className="text-xs text-muted-foreground">
                            {m.label}
                          </p>
                          <p className="mt-1 text-lg font-bold tabular-nums">
                            {end} {m.unit}
                          </p>
                          <p
                            className={cn(
                              "mt-0.5 flex items-center justify-center gap-0.5 text-xs font-semibold tabular-nums",
                              delta === 0
                                ? "text-muted-foreground"
                                : "text-primary"
                            )}
                          >
                            <Icon className="size-3" />
                            {delta > 0 ? "+" : ""}
                            {delta} {m.unit}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* ------------------------------ Historial ------------------------------ */}
      {sorted.length > 0 && (
        <section aria-label="Historial de registros" className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Historial de registros</h2>
          <div className="space-y-2">
            {[...sorted].reverse().map((entry) => (
              <Card key={entry.id}>
                <CardContent className="flex items-center justify-between gap-3 py-3">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                    <span className="font-semibold">
                      {new Date(entry.date).toLocaleDateString("es", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="tabular-nums">
                      <span className="text-muted-foreground">Peso:</span>{" "}
                      {entry.weight} kg
                    </span>
                    {(
                      [
                        ["arm", "Brazo"],
                        ["chest", "Pecho"],
                        ["waist", "Cintura"],
                        ["leg", "Pierna"],
                      ] as const
                    ).map(([field, label]) =>
                      entry.measurements[field] !== undefined ? (
                        <span key={field} className="tabular-nums">
                          <span className="text-muted-foreground">
                            {label}:
                          </span>{" "}
                          {entry.measurements[field]} cm
                        </span>
                      ) : null
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    aria-label="Eliminar registro"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
