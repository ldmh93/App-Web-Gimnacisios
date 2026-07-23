import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Marca AURA GYM.
 * Isotipo: emblema oficial servido desde public/brand/mark.png.
 * Para reemplazarlo basta con sustituir ese archivo.
 */

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-block size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/50",
        className
      )}
      aria-hidden="true"
    >
      <Image
        src="/brand/mark.png"
        alt=""
        fill
        sizes="192px"
        className="object-cover"
        priority
      />
    </span>
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
          AURA <span className="text-primary">GYM</span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="AURA GYM — inicio" className="shrink-0">
      {content}
    </Link>
  );
}
