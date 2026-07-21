"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { UserAvatar } from "@/components/UserAvatar";
import type { UserProfile } from "@/lib/types";

/**
 * "QR" decorativo determinista a partir de una cadena (el número de socio).
 * No es un QR escaneable real: es un patrón visual estable para la credencial.
 */
function FakeQR({ seed }: { seed: string }) {
  const size = 11;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  let state = h >>> 0;
  for (let i = 0; i < size * size; i++) {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    cells.push((state & 0x10000) !== 0);
  }
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="size-full"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % size}
            y={Math.floor(i / size)}
            width={1}
            height={1}
            fill="#111"
          />
        ) : null
      )}
      {/* Esquinas tipo QR */}
      {[
        [0, 0],
        [size - 3, 0],
        [0, size - 3],
      ].map(([x, y], k) => (
        <g key={`c${k}`}>
          <rect x={x} y={y} width={3} height={3} fill="#111" />
          <rect x={x + 1} y={y + 1} width={1} height={1} fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

export function MemberCard({ profile }: { profile: UserProfile }) {
  const since = profile.memberSince
    ? new Date(profile.memberSince + "T00:00:00").toLocaleDateString("es", {
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 p-6 text-white shadow-2xl"
      style={{
        background:
          "radial-gradient(120% 120% at 15% 10%, #3a1114 0%, #1d0e10 55%, #120a0b 100%)",
      }}
    >
      {/* Brillos de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, #e11d2e, transparent)" }}
      />

      <div className="relative flex items-center justify-between">
        <LogoMark className="size-9" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Carnet de socio
        </span>
      </div>

      <div className="relative mt-6 flex items-center gap-4">
        <UserAvatar
          name={profile.name}
          avatar={profile.avatar}
          className="size-20 text-2xl ring-2 ring-primary/60"
        />
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold">{profile.name}</p>
          <p className="text-sm text-white/70">
            {profile.plan ?? "Mensualidad"}
          </p>
          <span className="mt-1 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
            ● Activo
          </span>
        </div>
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              N.º de socio
            </p>
            <p className="font-mono font-semibold tracking-wide">
              {profile.memberNumber}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Socio desde
            </p>
            <p className="font-semibold capitalize">{since}</p>
          </div>
        </div>
        <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-white p-1">
          <FakeQR seed={profile.memberNumber ?? "MAYCOL"} />
        </div>
      </div>

      <p className="relative mt-5 text-center text-[10px] uppercase tracking-widest text-white/40">
        MAYCOL GYM · Presenta este carnet en recepción
      </p>
    </motion.div>
  );
}
