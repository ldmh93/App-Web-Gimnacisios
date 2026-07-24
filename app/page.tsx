"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { InteractiveBackground } from "@/components/InteractiveBackground";
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
      "Planes de membresía, horarios y contacto directo por WhatsApp con AURA GYM.",
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
  const router = useRouter();
  const [profile, , hydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );

  // Si ya hay perfil, la landing de marketing no aporta: el socio aterriza
  // directamente en su Dashboard (P8).
  useEffect(() => {
    if (hydrated && profile) router.replace("/dashboard");
  }, [hydrated, profile, router]);

  // Evita el parpadeo de la landing mientras se redirige a un socio existente.
  if (hydrated && profile) return null;

  // Si aún no hay perfil, el botón principal lleva a crear la cuenta.
  const startHref = "/bienvenido";
  const startLabel = "Crear mi cuenta";

  return (
    <div className="relative overflow-hidden">
      {/* Fondo dinámico e interactivo */}
      <InteractiveBackground />

      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={item} className="relative mb-10">
            {/* Halo pulsante detrás del logo */}
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl sm:size-56"
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Flotación continua */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Interacción al pasar el cursor */}
              <motion.div
                whileHover={{ scale: 1.07, rotate: 3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-pointer drop-shadow-[0_10px_30px_rgba(225,29,46,0.45)]"
              >
                <LogoMark className="relative h-36 w-36 sm:h-44 sm:w-44" />
              </motion.div>
            </motion.div>
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
