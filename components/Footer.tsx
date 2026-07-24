"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { Logo } from "@/components/Logo";

/**
 * Pie de página con el crédito del creador. Solo se muestra en pantallas
 * "de presentación" (landing, gimnasio, perfil); en las pantallas de uso
 * diario sería ruido repetido en cada vista, así que ahí se omite (P10).
 */
const FOOTER_ROUTES = ["/", "/gimnasio", "/perfil"];

export function Footer() {
  const pathname = usePathname();
  if (!FOOTER_ROUTES.includes(pathname)) return null;

  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 pb-28 text-center sm:px-6 lg:pb-8">
        <Logo href={null} markClassName="size-8" textClassName="text-base" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Creado por <span className="text-primary">Luis D. Maldonado</span>
          </p>
          <a
            href="tel:+524171279042"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="size-3.5" />
            417 127 9042
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} AURA GYM · Todos los derechos
          reservados
        </p>
      </div>
    </footer>
  );
}
