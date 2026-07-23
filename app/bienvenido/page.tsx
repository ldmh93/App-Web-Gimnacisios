"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Sparkles, UserRound } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
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
import { STORAGE_KEYS } from "@/lib/storage";
import { calculateNutrition } from "@/utils/macros";
import { GOAL_ADJUSTMENTS } from "@/utils/calories";
import { GYM_PLANS } from "@/data/gym";
import type {
  Goal,
  Level,
  NutritionResult,
  Sex,
  UserProfile,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVELS: { id: Level; label: string }[] = [
  { id: "principiante", label: "Principiante" },
  { id: "intermedio", label: "Intermedio" },
  { id: "avanzado", label: "Avanzado" },
];

/** Genera un número de socio corto y legible: AG-2607-4821 */
function newMemberNumber(): string {
  const rnd = Math.floor(1000 + Math.random() * 9000);
  const d = new Date();
  const mmdd = `${String(d.getDate()).padStart(2, "0")}${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
  return `AG-${mmdd}-${rnd}`;
}

export default function BienvenidoPage() {
  const router = useRouter();
  const [, setProfile] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );
  const [, setNutrition] = useLocalStorage<NutritionResult | null>(
    STORAGE_KEYS.nutrition,
    null
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    age: "25",
    sex: "hombre" as Sex,
    weight: "75",
    height: "175",
    goal: "ganar-musculo" as Goal,
    level: "principiante" as Level,
    daysPerWeek: "3",
    plan: "mensual",
  });

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const onPickPhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const valid =
    form.name.trim().length >= 2 &&
    Number(form.age) >= 14 &&
    Number(form.age) <= 100 &&
    Number(form.weight) >= 30 &&
    Number(form.height) >= 120;

  const submit = () => {
    if (!valid) return;
    const profile: UserProfile = {
      name: form.name.trim(),
      avatar: avatar || undefined,
      age: Number(form.age),
      sex: form.sex,
      weight: Number(form.weight),
      height: Number(form.height),
      activity: "moderado",
      goal: form.goal,
      level: form.level,
      daysPerWeek: Number(form.daysPerWeek),
      plan: GYM_PLANS.find((p) => p.id === form.plan)?.name ?? "Mensualidad",
      memberNumber: newMemberNumber(),
      memberSince: new Date().toISOString().slice(0, 10),
    };
    setProfile(profile);
    setNutrition(calculateNutrition(profile));
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Fondo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-15%] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg rounded-3xl border border-border/60 bg-card/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="mb-3 size-14" />
          <h1 className="text-2xl font-extrabold tracking-tight">
            Crea tu perfil
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personaliza tu experiencia en AURA GYM. Se guarda en tu
            dispositivo, sin cuentas ni contraseñas.
          </p>
        </div>

        {/* Foto */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative size-24 overflow-hidden rounded-full border-2 border-dashed border-primary/40 bg-muted transition-colors hover:border-primary"
            aria-label="Subir foto de perfil"
          >
            {avatar ? (
              <Image
                src={avatar}
                alt="Tu foto"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-primary">
                <Camera className="size-6" />
                <span className="text-[10px] font-medium">Foto</span>
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickPhoto(e.target.files?.[0])}
          />
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className="pl-9"
                autoFocus
              />
            </div>
          </div>

          {/* Datos físicos */}
          <div className="grid grid-cols-2 gap-3">
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
              <Select value={form.sex} onValueChange={set("sex")}>
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

          {/* Objetivo y nivel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Select value={form.goal} onValueChange={set("goal")}>
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
              <Label>Nivel</Label>
              <Select value={form.level} onValueChange={set("level")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Días por semana */}
          <div className="space-y-2">
            <Label>¿Cuántos días por semana quieres entrenar?</Label>
            <div className="flex gap-2">
              {["2", "3", "4", "5", "6"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set("daysPerWeek")(d)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-semibold transition-colors",
                    form.daysPerWeek === d
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <Label>Plan de membresía</Label>
            <Select value={form.plan} onValueChange={set("plan")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GYM_PLANS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} · ${p.price} {p.period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={submit}
          disabled={!valid}
          size="lg"
          className="glow-primary-soft mt-6 w-full text-base font-semibold"
        >
          <Sparkles className="size-5" />
          Crear mi perfil y empezar
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Con esto calculamos tus calorías, generamos tu carnet de socio y te
          recomendamos una rutina.
        </p>
      </motion.div>
    </div>
  );
}
