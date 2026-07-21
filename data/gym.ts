/**
 * Datos del gimnasio (MAYCOL GYM).
 * Valores de ejemplo: reemplázalos por los reales cuando los tengas.
 * Cuando exista base de datos, esto vendrá de la tabla `gyms`.
 */

export const GYM_INFO = {
  name: "MAYCOL GYM",
  slogan: "Transforma tu cuerpo. Construye tu mejor versión.",
  phone: "417 127 9042",
  /** Número internacional para el enlace de WhatsApp (sin +, espacios ni signos). */
  whatsapp: "524171279042",
  email: "contacto@maycolgym.com",
  address: "Av. Principal 123, Centro, tu ciudad",
  instagram: "@maycolgym",
};

export interface GymPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  featured?: boolean;
  perks: string[];
}

export const GYM_PLANS: GymPlan[] = [
  {
    id: "visita",
    name: "Pase del día",
    price: 60,
    period: "por visita",
    perks: [
      "Acceso completo por un día",
      "Uso de todas las máquinas",
      "Ideal para probar el gym",
    ],
  },
  {
    id: "mensual",
    name: "Mensualidad",
    price: 450,
    period: "al mes",
    featured: true,
    perks: [
      "Acceso ilimitado todo el mes",
      "Rutina personalizada",
      "Asesoría de los entrenadores",
      "Acceso a la app MAYCOL GYM",
    ],
  },
  {
    id: "trimestral",
    name: "Trimestre",
    price: 1150,
    period: "3 meses",
    perks: [
      "Todo lo de la mensualidad",
      "Ahorro frente a pagar mes a mes",
      "Valoración física de seguimiento",
    ],
  },
  {
    id: "anual",
    name: "Anualidad",
    price: 3900,
    period: "al año",
    perks: [
      "Acceso ilimitado todo el año",
      "El mejor precio por mes",
      "Plan nutricional incluido",
      "Congelamiento hasta 1 mes",
    ],
  },
];

export interface GymSchedule {
  days: string;
  hours: string;
}

export const GYM_SCHEDULE: GymSchedule[] = [
  { days: "Lunes a viernes", hours: "6:00 – 22:00" },
  { days: "Sábado", hours: "8:00 – 18:00" },
  { days: "Domingo", hours: "9:00 – 14:00" },
];

/** Enlace de WhatsApp con mensaje prellenado. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${GYM_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
}
