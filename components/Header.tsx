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

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ejercicios", label: "Ejercicios" },
  { href: "/rutinas", label: "Rutinas" },
  { href: "/nutricion", label: "Nutrición" },
  { href: "/suplementos", label: "Suplementos" },
  { href: "/progreso", label: "Progreso" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, , profileHydrated] = useLocalStorage<UserProfile | null>(
    STORAGE_KEYS.profile,
    null
  );
  const firstName = profile?.name?.split(/\s+/)[0];

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Izquierda: logo + nombre */}
        <Logo />

        {/* Centro: navegación (escritorio) */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Derecha: usuario + tema + configuración + menú móvil */}
        <div className="flex items-center gap-1">
          {profileHydrated && profile && (
            <span className="mr-1 hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-muted-foreground">
                Hola,{" "}
                <span className="font-semibold text-foreground">
                  {firstName}
                </span>{" "}
                👋
              </span>
            </span>
          )}
          {profileHydrated && !profile && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="mr-1 hidden sm:inline-flex"
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
                  { href: "/gimnasio", label: "El gimnasio" },
                  { href: "/educacion", label: "Educación" },
                ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        pathname.startsWith(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
