"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Dumbbell,
  GraduationCap,
  LineChart,
  UtensilsCrossed,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { GymCarousel } from "@/components/GymCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Ejercicios",
    description:
      "Biblioteca completa por grupo muscular con técnica, errores comunes y consejos de cada ejercicio.",
    href: "/ejercicios",
  },
  {
    icon: ClipboardList,
    title: "Rutinas inteligentes",
    description:
      "Rutinas predefinidas por nivel y un constructor para crear las tuyas ejercicio a ejercicio.",
    href: "/rutinas",
  },
  {
    icon: UtensilsCrossed,
    title: "Planes nutricionales",
    description:
      "Calculadora de calorías y macros más 10 dietas completas listas para aplicar hoy.",
    href: "/nutricion",
  },
  {
    icon: LineChart,
    title: "Seguimiento corporal",
    description:
      "Registra peso y medidas, visualiza tu evolución y compara tu progreso real.",
    href: "/progreso",
  },
  {
    icon: GraduationCap,
    title: "Educación fitness",
    description:
      "Artículos claros sobre entrenamiento, técnica, descanso y alimentación deportiva.",
    href: "/educacion",
  },
  {
    icon: Building2,
    title: "El gimnasio",
    description:
      "Planes de membresía, horarios y contacto directo por WhatsApp con MAYCOL GYM.",
    href: "/gimnasio",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function LandingPage() {
  const [profile] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );
  // Si aún no hay perfil, el botón principal lleva a crear la cuenta.
  const startHref = profile ? "/dashboard" : "/bienvenido";
  const startLabel = profile ? "Comenzar entrenamiento" : "Crear mi cuenta";

  return (
    <div className="relative overflow-hidden">
      {/* Fondo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={item} className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/25 blur-3xl" />
            <LogoMark className="relative h-24 w-24 sm:h-28 sm:w-28" />
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
          >
            Transforma tu cuerpo.
            <br />
            <span className="text-gradient-brand">
              Construye tu mejor versión.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-lg text-muted-foreground"
          >
            Entrena, alimenta y controla tu progreso desde una sola plataforma.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="glow-primary-soft px-8 text-base font-semibold"
            >
              <Link href={startHref}>
                {startLabel}
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 text-base font-semibold"
            >
              <Link href="/ejercicios">
                <Dumbbell className="size-5" />
                Biblioteca de ejercicios
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Galería del gimnasio */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
            Conoce <span className="text-gradient-brand">nuestro gimnasio</span>
          </h2>
          <GymCarousel />
        </motion.div>
      </section>

      {/* Tarjetas informativas */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Link href={feature.href} className="group block h-full">
                <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg">
                  <CardContent className="space-y-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="size-5" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
