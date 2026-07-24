"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  GraduationCap,
  Pill,
  Settings,
  Trash2,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, resetLocalDataWithConfirm } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Navegación esencial (escritorio). En móvil la navegación vive en la barra
 * inferior (BottomNav) y lo secundario en la pestaña Perfil; el header móvil
 * solo muestra la marca y el tema.
 */
const NAV_ITEMS = [
  { href: "/dashboard", label: "Hoy" },
  { href: "/ejercicios", label: "Ejercicios" },
  { href: "/rutinas", label: "Rutinas" },
  { href: "/nutricion", label: "Nutrición" },
  { href: "/progreso", label: "Progreso" },
];

export function Header() {
  const pathname = usePathname();
  const [profile, , profileHydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4">
      <motion.div
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="mx-auto mt-3 flex h-14 max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/15 bg-background/55 px-3 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/45 sm:px-4 dark:border-white/10"
      >
        {/* Izquierda: logo + nombre */}
        <Logo />

        {/* Centro: navegación esencial (escritorio) */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.96]",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/12 ring-1 ring-primary/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Derecha: tema (siempre) + menú de usuario (solo escritorio) */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* En móvil, perfil/ajustes y secciones secundarias viven en la
              pestaña Perfil de la barra inferior; aquí se ocultan. */}
          <div className="hidden items-center gap-1 lg:flex">
            {profileHydrated && !profile && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="mr-1 rounded-full"
              >
                <Link href="/bienvenido">
                  <UserPlus className="size-4" />
                  Crear perfil
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {profile ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Menú de usuario"
                  >
                    <UserAvatar
                      name={profile.name}
                      avatar={profile.avatar}
                      className="size-8"
                    />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" aria-label="Configuración">
                    <Settings className="size-5" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {profile ? (
                  <>
                    <DropdownMenuLabel className="flex items-center gap-2.5">
                      <UserAvatar
                        name={profile.name}
                        avatar={profile.avatar}
                        className="size-9"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {profile.name}
                        </span>
                        <span className="block truncate text-xs font-normal text-muted-foreground">
                          Socio · {profile.memberNumber}
                        </span>
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">
                        <UserRound className="size-4" />
                        Mi perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/carnet">
                        <BadgeCheck className="size-4" />
                        Mi carnet de socio
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bienvenido">
                        <Settings className="size-4" />
                        Editar mi perfil
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Configuración</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/bienvenido">
                        <UserPlus className="size-4" />
                        Crear mi perfil
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/suplementos">
                    <Pill className="size-4" />
                    Suplementos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/gimnasio">
                    <Building2 className="size-4" />
                    El gimnasio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/educacion">
                    <GraduationCap className="size-4" />
                    Educación fitness
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={resetLocalDataWithConfirm}
                >
                  <Trash2 className="size-4" />
                  Borrar datos locales
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
