import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/components/AppProvider";
import { AppShell } from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MARA FITNESS — Entrena con constancia",
    template: "%s | MARA FITNESS",
  },
  description:
    "Entrena, aliméntate y controla tu progreso desde una sola plataforma. Rutinas inteligentes, planes nutricionales y seguimiento corporal.",
  // Tarjeta que se ve al compartir el enlace (WhatsApp, redes, Slack).
  // La imagen la aporta app/opengraph-image.png por convención del App Router.
  openGraph: {
    type: "website",
    siteName: "MARA FITNESS",
    title: "MARA FITNESS — Entrena con constancia",
    description:
      "Rutinas, biblioteca de ejercicios con mapa muscular, seguimiento de progreso y nutrición.",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARA FITNESS — Entrena con constancia",
    description:
      "Rutinas, biblioteca de ejercicios con mapa muscular, seguimiento de progreso y nutrición.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppProvider>
            <AppShell>{children}</AppShell>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
