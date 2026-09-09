"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/components/AppProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";

/** Rutas visibles sin iniciar sesión. */
const PUBLIC_ROUTES = ["/", "/login"];

/** Mínimo visible para que la bienvenida no dé un fogonazo. */
const SPLASH_MIN_MS = 450;
/** Tope duro: pase lo que pase, a los 2 s se entra a la aplicación. */
const SPLASH_MAX_MS = 2000;

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

/**
 * Envoltorio de la aplicación: bienvenida, guardas de sesión y qué "cromo"
 * (header, barra inferior) corresponde a cada zona.
 *
 * El panel de administración trae su propia navegación, así que allí no se
 * pintan ni el header ni la barra inferior del usuario: son dos experiencias
 * distintas, no la misma con piezas ocultas.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, account, isAdmin } = useApp();

  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  // La bienvenida solo aparece en el primer arranque de la pestaña, no al
  // navegar entre pantallas.
  useEffect(() => {
    const alreadyShown =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("fitcore:splash") === "visto";
    if (alreadyShown) {
      setSplashDone(true);
      return;
    }
    const min = window.setTimeout(() => setMinElapsed(true), SPLASH_MIN_MS);
    const max = window.setTimeout(() => setTimedOut(true), SPLASH_MAX_MS);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(max);
    };
  }, []);

  // Se cierra en cuanto la app está lista (o al agotar el tope), nunca antes
  // del mínimo: así no se espera de más ni se parpadea de menos.
  useEffect(() => {
    if (splashDone) return;
    if ((ready && minElapsed) || timedOut) {
      setSplashDone(true);
      window.sessionStorage.setItem("fitcore:splash", "visto");
    }
  }, [ready, minElapsed, timedOut, splashDone]);

  // Guardas de acceso. Solo actúan cuando ya se leyó el almacenamiento, para
  // no expulsar a nadie por un estado todavía sin hidratar.
  useEffect(() => {
    if (!ready) return;
    if (!account && !isPublic(pathname)) {
      router.replace("/login");
      return;
    }
    if (account && pathname === "/login") {
      router.replace(isAdmin ? "/admin" : "/dashboard");
      return;
    }
    if (pathname.startsWith("/admin") && account && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [ready, account, isAdmin, pathname, router]);

  const isAdminArea = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";
  const showChrome = !isAdminArea && !isLogin;

  // Mientras la guarda decide, se evita mostrar contenido protegido.
  const blocked =
    ready &&
    ((!account && !isPublic(pathname)) ||
      (pathname.startsWith("/admin") && account && !isAdmin));

  return (
    <>
      <AnimatePresence>{!splashDone && <SplashScreen />}</AnimatePresence>

      {showChrome && <Header />}
      <main className={showChrome ? "pt-20" : undefined}>
        {blocked ? null : children}
      </main>
      {showChrome && <Footer />}
      {showChrome && <BottomNav />}
    </>
  );
}
