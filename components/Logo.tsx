import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Marca FITCORE.
 * Isotipo: hexágono (disciplina/estructura) con tres barras ascendentes
 * (crecimiento/transformación). Hereda el color primario del tema.
 * Reemplazable: basta con sustituir el SVG de <LogoMark /> manteniendo
 * las mismas props.
 */

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <path
        d="M24 3.5 41.5 13.75v20.5L24 44.5 6.5 34.25v-20.5L24 3.5Z"
        className="stroke-primary"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="15" y="26" width="5" height="9" rx="1.5" className="fill-primary/50" />
      <rect x="21.5" y="20" width="5" height="15" rx="1.5" className="fill-primary/75" />
      <rect x="28" y="13" width="5" height="22" rx="1.5" className="fill-primary" />
    </svg>
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
            "text-xl font-extrabold uppercase tracking-widest",
            textClassName
          )}
        >
          FIT<span className="text-primary">CORE</span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="FITCORE — inicio" className="shrink-0">
      {content}
    </Link>
  );
}
