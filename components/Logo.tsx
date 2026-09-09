"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { brandColor, brandName } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Marca de la aplicación.
 *
 * El nombre y las imágenes salen de la configuración editable desde /admin
 * (lib/brand.ts), no de constantes en el código: así el mismo producto puede
 * presentarse a distintos gimnasios con su identidad.
 *
 * Se usa <img> y no next/image a propósito, porque el logotipo puede ser un
 * data URL subido por el administrador y next/image exige rutas conocidas en
 * tiempo de compilación.
 */

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  const { brand } = useApp();
  return (
    <span
      className={cn("relative inline-block size-9 shrink-0", className)}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.mark}
        alt=""
        className="size-full object-contain"
        draggable={false}
      />
    </span>
  );
}

interface LogoFullProps {
  className?: string;
  alt?: string;
}

/** Logotipo completo con lettering. Para usos grandes (portada, bienvenida). */
export function LogoFull({ className, alt }: LogoFullProps) {
  const { brand } = useApp();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logo}
      alt={alt ?? brandName(brand)}
      className={cn("h-auto w-auto object-contain", className)}
      draggable={false}
    />
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  href?: string | null;
}

export function Logo({
  className,
  markClassName,
  textClassName,
  showText = true,
  href = "/",
}: LogoProps) {
  const { brand } = useApp();

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      {showText && (
        <span
          className={cn(
            "text-lg font-extrabold uppercase tracking-widest",
            textClassName
          )}
          style={{ color: brandColor(brand.nameColor) }}
        >
          {brand.name}
          {brand.nameAccent && (
            <span
              className="text-primary"
              style={{ color: brandColor(brand.accentColor) }}
            >
              {" "}
              {brand.nameAccent}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={`${brandName(brand)} — inicio`}
      className="shrink-0"
    >
      {content}
    </Link>
  );
}
