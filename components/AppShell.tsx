"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/components/AppProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { presentationSeen } from "@/lib/onboarding";

/**
 * Rutas visibles sin iniciar sesión.
 *
 * Solo el acceso. La raíz NO es pública a propósito: al abrir la aplicación se
 * entra por la presentación y de ahí al login o al inicio, como una app y no
 * como una web con portada. La portada de marketing (app/page.tsx) sigue en el
 * proyecto; para recuperarla basta con volver a añadir "/" aquí.
 */
const PUBLIC_ROUTES = ["/login", "/presentacion"];

/**
 * Duración de la presentación de marca.
 *
 * Es un mínimo deliberado: aunque la aplicación esté lista antes, la pantalla
 * se mantiene los 3,5 s completos porque su función aquí es de presentación,
 * no de carga.
 */
const SPLASH_MIN_MS = 3500;
/** Tope duro: si algo se atasca, a los 5 s se entra igualmente. */
const SPLASH_MAX_MS = 5000;

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

  // Se cierra al cumplirse el mínimo de presentación (o al agotar el tope si
  // algo se atasca). Si la app tarda más que ese mínimo, se espera a que esté
  // lista para no entrar a una pantalla a medio montar.
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
      // Quien todavía no conoce la app pasa por la presentación antes del
      // acceso; quien ya la vio va directo al acceso.
      router.replace(presentationSeen() ? "/login" : "/presentacion");
      return;
    }
    if (account && pathname === "/presentacion") {
      router.replace(isAdmin ? "/admin" : "/dashboard");
      return;
    }
    // Con sesión iniciada, ni el acceso ni la raíz tienen nada que ofrecer:
    // se entra directo a donde corresponde según el rol.
    if (account && (pathname === "/login" || pathname === "/")) {
      router.replace(isAdmin ? "/admin" : "/dashboard");
      return;
    }
    if (pathname.startsWith("/admin") && account && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [ready, account, isAdmin, pathname, router]);

  const isAdminArea = pathname.startsWith("/admin");
  const isLogin = pathname === "/login" || pathname === "/presentacion";
  const showChrome = !isAdminArea && !isLogin;

  // Mientras la guarda decide, se evita mostrar contenido protegido.
  const blocked =
    ready &&
    ((!account && !isPublic(pathname)) ||
      (account && pathname === "/") ||
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
