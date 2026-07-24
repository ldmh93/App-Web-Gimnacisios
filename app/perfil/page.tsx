"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  ChevronRight,
  GraduationCap,
  LineChart,
  Pill,
  Settings2,
  Trash2,
  UserPlus,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, resetLocalDataWithConfirm } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

/** Accesos que agrupa la pestaña Perfil (identidad + secciones secundarias). */
const LINKS: {
  href: string;
  label: string;
  hint: string;
  icon: typeof BadgeCheck;
  requiresProfile?: boolean;
}[] = [
  {
    href: "/carnet",
    label: "Mi carnet de socio",
    hint: "Tu credencial digital",
    icon: BadgeCheck,
    requiresProfile: true,
  },
  {
    href: "/progreso",
    label: "Mi progreso",
    hint: "Peso, medidas y evolución",
    icon: LineChart,
  },
  {
    href: "/gimnasio",
    label: "El gimnasio",
    hint: "Planes, horarios y contacto",
    icon: Building2,
  },
  {
    href: "/suplementos",
    label: "Suplementos",
    hint: "Guía educativa",
    icon: Pill,
  },
  {
    href: "/educacion",
    label: "Educación fitness",
    hint: "Artículos y fundamentos",
    icon: GraduationCap,
  },
];

export default function PerfilPage() {
  const [profile, , hydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );

  if (!hydrated) return null;

  const links = LINKS.filter((l) => !l.requiresProfile || profile);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Cabecera: identidad del socio o invitación a crear perfil */}
      {profile ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4">
              <UserAvatar
                name={profile.name}
                avatar={profile.avatar}
                className="size-16 text-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-bold">{profile.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  Socio · {profile.memberNumber}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/bienvenido">Editar</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <UserPlus className="size-8 text-primary" />
              <div>
                <p className="font-semibold">Aún no tienes perfil</p>
                <p className="text-sm text-muted-foreground">
                  Créalo para tu carnet, tus macros y tu rutina personalizada.
                </p>
              </div>
              <Button asChild className="glow-primary-soft">
                <Link href="/bienvenido">
                  <UserPlus className="size-4" />
                  Crear mi perfil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Accesos */}
      <nav aria-label="Secciones" className="mt-6">
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50 active:bg-muted"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <link.icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{link.label}</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {link.hint}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </nav>

      {/* Ajustes */}
      <section aria-label="Ajustes" className="mt-6">
        <h2 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-muted-foreground">
          <Settings2 className="size-4" />
          Ajustes
        </h2>
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            <li className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="font-medium">Tema</span>
              <ThemeToggle />
            </li>
            <li>
              <button
                type="button"
                onClick={resetLocalDataWithConfirm}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-destructive transition-colors hover:bg-destructive/10 active:bg-destructive/15"
              >
                <Trash2 className="size-5 shrink-0" />
                <span className="font-medium">Borrar mis datos locales</span>
              </button>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
