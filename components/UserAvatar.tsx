"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

/** Iniciales a partir del nombre (máx. 2 letras). */
export function initials(name?: string): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  name,
  avatar,
  className,
}: {
  name?: string;
  avatar?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-bold text-primary ring-1 ring-primary/40",
        className
      )}
      aria-hidden="true"
    >
      {avatar ? (
        <Image src={avatar} alt="" fill unoptimized className="object-cover" />
      ) : name ? (
        initials(name)
      ) : (
        <UserRound className="size-4" />
      )}
    </span>
  );
}
