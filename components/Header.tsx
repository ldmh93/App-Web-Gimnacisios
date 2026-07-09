"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Menu, Settings, Trash2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { STORAGE_KEYS, removeFromStorage } from "@/lib/storage";
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

        {/* Derecha: tema + configuración + menú móvil */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Configuración">
                <Settings className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Configuración</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              <nav className="flex flex-col gap-1 px-4" aria-label="Menú móvil">
                {[...NAV_ITEMS, { href: "/educacion", label: "Educación" }].map(
                  (item) => (
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
