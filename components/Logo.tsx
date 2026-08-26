import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Marca MORA'S GYM.
 * Isotipo (emblema): public/brand/mark.png — corona, círculo y figura.
 * Logotipo completo (con lettering): public/brand/logo.png.
 * Para reemplazarlos basta con sustituir esos archivos.
 */

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      className={cn("relative inline-block size-9 shrink-0", className)}
      aria-hidden="true"
    >
      <Image
        src="/brand/mark.png"
        alt=""
        fill
        sizes="192px"
        className="object-contain"
        priority
      />
    </span>
  );
}

interface LogoFullProps {
  className?: string;
  /** Texto alternativo; vacío si el logo es decorativo junto a un título. */
  alt?: string;
  priority?: boolean;
}

/** Logotipo completo con el lettering MORA'S GYM. Para usos grandes (portada). */
export function LogoFull({
  className,
  alt = "MORA'S GYM",
  priority = false,
}: LogoFullProps) {
  return (
    <Image
      src="/brand/logo.png"
      alt={alt}
      width={1200}
      height={1312}
      sizes="(max-width: 640px) 60vw, 420px"
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
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
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      {showText && (
        <span
          className={cn(
            "text-lg font-extrabold uppercase tracking-widest",
            textClassName
          )}
        >
          MORA&apos;S <span className="text-primary">GYM</span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="MORA'S GYM — inicio" className="shrink-0">
      {content}
    </Link>
  );
}
