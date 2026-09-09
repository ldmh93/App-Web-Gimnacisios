"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ADMIN, login, register, startSession } from "@/lib/auth";
import { brandColor, brandName, splashImage } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Mode = "entrar" | "crear";

/**
 * Acceso a la aplicación.
 *
 * Una sola pantalla con dos modos (entrar / crear cuenta) en lugar de dos
 * rutas: en móvil, alternar con una pestaña es más rápido que navegar, y evita
 * duplicar el formulario.
 */
export default function LoginPage() {
  const router = useRouter();
  const { brand, refresh } = useApp();

  const [mode, setMode] = useState<Mode>("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "entrar") {
        const result = await login(email, password);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        refresh();
        router.replace(result.account.role === "admin" ? "/admin" : "/dashboard");
      } else {
        const result = await register({ name, email, password });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        startSession(result.account);
        refresh();
        // Cuenta nueva: se manda a completar el perfil, que es lo que
        // personaliza rutinas y macros.
        router.replace("/bienvenido");
      }
    } finally {
      setBusy(false);
    }
  };

  /** Rellena las credenciales del administrador de demostración. */
  const fillAdmin = () => {
    setMode("entrar");
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError(null);
  };

  return (
    <div className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-[#0c0c10] px-5 py-10">
      {/* Ambiente de marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto w-full max-w-sm"
      >
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={splashImage(brand)}
            alt=""
            className="h-20 w-auto max-w-[60vw] object-contain"
          />
          <h1
            className="mt-4 text-3xl font-extrabold uppercase tracking-[0.15em] text-white"
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
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {mode === "entrar"
              ? "Entra para seguir tu entrenamiento"
              : "Crea tu cuenta y empieza a entrenar"}
          </p>
        </div>

        {/* Selector de modo */}
        <div
          role="tablist"
          aria-label="Modo de acceso"
          className="mt-7 flex rounded-full border border-white/10 bg-white/5 p-1"
        >
          {(["entrar", "crear"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={cn(
                "relative min-h-[42px] flex-1 rounded-full text-sm font-semibold transition-colors",
                mode === m ? "text-primary-foreground" : "text-white/60"
              )}
            >
              {mode === m && (
                <motion.span
                  layoutId="login-mode"
                  className="absolute inset-0 -z-10 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {m === "entrar" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <AnimatePresence initial={false}>
            {mode === "crear" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="text-white/70">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Tu nombre"
                    className="h-12 border-white/15 bg-white/5 text-white placeholder:text-white/30"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <Label htmlFor="correo" className="text-white/70">
              Correo
            </Label>
            <Input
              id="correo"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              className="h-12 border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clave" className="text-white/70">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="clave"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "entrar" ? "current-password" : "new-password"
                }
                placeholder="••••••••"
                className="h-12 border-white/15 bg-white/5 pr-12 text-white placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="glow-primary-soft h-14 w-full text-base font-bold uppercase tracking-wide"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : mode === "entrar" ? (
              <LogIn className="size-5" />
            ) : (
              <UserPlus className="size-5" />
            )}
            {mode === "entrar" ? "Entrar" : "Crear mi cuenta"}
          </Button>
        </form>

        {mode === "entrar" && (
          <button
            type="button"
            onClick={() =>
              window.alert(
                "La recuperación por correo necesita servidor y todavía no está conectada. Si olvidaste tu contraseña, pide al administrador del gimnasio que restablezca tu cuenta desde el panel."
              )
            }
            className="mt-4 w-full text-center text-sm text-white/50 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {/* Acceso de demostración: este panel es local, sin servidor */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/50">
            <ShieldCheck className="size-3.5" />
            Acceso de administrador
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/40">
            {DEMO_ADMIN.email} · {DEMO_ADMIN.password}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillAdmin}
            className="mt-3 w-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            Entrar como administrador
          </Button>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/30">
          Las cuentas se guardan en este dispositivo. {brandName(brand)} todavía
          no tiene servidor, así que no uses una contraseña que utilices en
          otros servicios.
        </p>
      </motion.div>
    </div>
  );
}
