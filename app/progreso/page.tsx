"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  LineChart,
  MoveDown,
  MoveRight,
  MoveUp,
  PlusCircle,
  Ruler,
  Scale,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ProgressChart } from "@/components/ProgressChart";
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
import type { Measurements, ProgressEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type Metric = "weight" | keyof Measurements;

const METRICS: { id: Metric; label: string; unit: string }[] = [
  { id: "weight", label: "Peso", unit: "kg" },
  { id: "arm", label: "Brazo", unit: "cm" },
  { id: "chest", label: "Pecho", unit: "cm" },
  { id: "waist", label: "Cintura", unit: "cm" },
  { id: "leg", label: "Pierna", unit: "cm" },
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
  leg: "",
};

export default function ProgresoPage() {
  const [entries, setEntries] = useLocalStorage<ProgressEntry[]>(
    STORAGE_KEYS.progress,
    []
  );
  const [form, setForm] = useState(EMPTY_FORM);
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
    if (form.leg) measurements.leg = Number(form.leg);

    setEntries((prev) => [
      ...prev,
      {
        id: generateId("registro"),
        date: form.date,
        weight: Number(form.weight),
        measurements,
      },
    ]);
    setForm({ ...EMPTY_FORM, date: form.date });
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Seguimiento"
        title="Progreso"
        description="Registra tu peso y medidas corporales, visualiza tu evolución y compara tu punto de partida con tu presente."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
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
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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

          {/* ------------------------- Fotos de progreso ------------------------- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="size-5 text-primary" />
                Fotos de progreso
              </CardTitle>
              <CardDescription>
                Disponible próximamente: guarda fotos de antes y después para
                comparar tu transformación visual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {["Antes", "Durante", "Ahora"].map((label) => (
                  <div
                    key={label}
                    className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 text-muted-foreground"
                  >
                    <Camera className="size-6" />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
