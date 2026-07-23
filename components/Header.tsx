"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  GraduationCap,
  Menu,
  Pill,
  Settings,
  Trash2,
  UserPlus,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, removeFromStorage } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Navegación esencial (escritorio). Lo secundario vive en el menú de usuario. */
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ejercicios", label: "Ejercicios" },
  { href: "/rutinas", label: "Rutinas" },
  { href: "/nutricion", label: "Nutrición" },
  { href: "/progreso", label: "Progreso" },
];

/** Se muestran también en el menú lateral móvil. */
const SECONDARY_ITEMS = [
  { href: "/suplementos", label: "Suplementos" },
  { href: "/gimnasio", label: "El gimnasio" },
  { href: "/educacion", label: "Educación" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, , profileHydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );

  const resetLocalData = () => {
    if (
      window.confirm(
        "¿Borrar todos los datos guardados (rutinas, progreso, perfil)? Esta acción no se puede deshacer."
      )
    ) {
      Object.values(STORAGE_KEYS).forEach(removeFromStorage);
      window.location.reload();
    }
  };

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

        {/* Derecha: usuario + tema + configuración + menú móvil */}
        <div className="flex items-center gap-1">
          {profileHydrated && !profile && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="mr-1 hidden rounded-full sm:inline-flex"
            >
              <Link href="/bienvenido">
                <UserPlus className="size-4" />
                Crear perfil
              </Link>
            </Button>
          )}

          <ThemeToggle />

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
              <DropdownMenuItem variant="destructive" onClick={resetLocalData}>
                <Trash2 className="size-4" />
                Borrar datos locales
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo href={null} />
                </SheetTitle>
              </SheetHeader>
              {profile && (
                <div className="mx-4 mb-2 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/50 p-3">
                  <UserAvatar
                    name={profile.name}
                    avatar={profile.avatar}
                    className="size-11"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{profile.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      Socio · {profile.memberNumber}
                    </p>
                  </div>
                </div>
              )}
              <nav className="flex flex-col gap-1 px-4" aria-label="Menú móvil">
                {[
                  ...NAV_ITEMS,
                  ...(profile
                    ? [{ href: "/carnet", label: "Mi carnet" }]
                    : [{ href: "/bienvenido", label: "Crear perfil" }]),
                  ...SECONDARY_ITEMS,
                ].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-base font-medium transition-colors active:scale-[0.98]",
                        pathname.startsWith(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
}
