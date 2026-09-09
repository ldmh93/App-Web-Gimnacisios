"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  LineChart,
  LogOut,
  Settings,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { brandName } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Módulos del panel. Un único sitio donde se declara la navegación de admin. */
export const ADMIN_SECTIONS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/rutinas", label: "Rutinas", icon: ClipboardList },
  { href: "/admin/ejercicios", label: "Ejercicios", icon: Dumbbell },
  { href: "/admin/progreso", label: "Progreso", icon: LineChart },
  { href: "/admin/nutricion", label: "Nutrición", icon: UtensilsCrossed },
  { href: "/admin/gimnasio", label: "Gimnasio", icon: Building2 },
  { href: "/admin/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

/**
 * Estructura del panel de administración.
 *
 * Es una experiencia deliberadamente distinta a la del socio: barra lateral en
 * escritorio (donde el dueño realmente administra) y tiras de módulos con
 * desplazamiento en móvil. No reutiliza el header ni la barra inferior de la
 * app de usuario para que no haya duda de en qué zona se está.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { brand, account, signOut } = useApp();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const exit = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-dvh bg-muted/30 lg:flex">
      {/* Barra lateral (escritorio) */}
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/50 lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <LogoMark className="size-9" />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold uppercase tracking-wider">
              {brandName(brand)}
            </p>
            <p className="text-xs text-muted-foreground">Administración</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Módulos">
          {ADMIN_SECTIONS.map((s) => {
            const active = isActive(s.href);
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className="size-[18px] shrink-0" />
                {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 p-3">
          <p className="truncate px-2 pb-2 text-xs text-muted-foreground">
            {account?.name} · {account?.email}
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/dashboard">Ver como socio</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={exit}
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Cabecera y módulos (móvil) */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <LogoMark className="size-8" />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold uppercase tracking-wider">
                  {brandName(brand)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Administración
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Socio</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={exit}
                aria-label="Cerrar sesión"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
          <nav
            aria-label="Módulos"
            className="flex gap-1.5 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ADMIN_SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors active:scale-95",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {s.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
