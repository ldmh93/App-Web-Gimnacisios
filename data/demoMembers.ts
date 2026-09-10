/**
 * Socios ficticios del gimnasio.
 *
 * Existen para que el panel de administración no se enseñe vacío: hay altas
 * repartidas en el tiempo y membresías en todos los estados posibles (activa,
 * por vencer, vencida y sin membresía), que es justo lo que hace falta para
 * demostrar los avisos del resumen y los filtros de Usuarios.
 *
 * Módulo deliberadamente ligero, sin dependencias: lo consume lib/auth.ts, y
 * meter aquí el catálogo de ejercicios cargaría 630 fichas solo para crear
 * cuentas.
 *
 * TODOS LOS DATOS SON FICTICIOS. Los correos usan el dominio de ejemplo del
 * gimnasio y no corresponden a personas reales.
 */

export interface DemoMemberSeed {
  name: string;
  email: string;
  /** Días desde el alta. */
  joinedDaysAgo: number;
  /** Plan de GYM_PLANS, o null si no tiene membresía activa. */
  plan: "visita" | "mensual" | "trimestral" | "anual" | null;
  /**
   * Días que faltan para el vencimiento. Negativo = ya vencida.
   * Se ignora cuando `plan` es null.
   */
  expiresInDays: number;
}

/** Contraseña común de los socios de ejemplo, para poder entrar con cualquiera. */
export const DEMO_MEMBER_PASSWORD = "demo1234";

export const DEMO_MEMBERS: DemoMemberSeed[] = [
  {
    name: "Andrea Salazar",
    email: "demo@marafitness.app",
    joinedDaysAgo: 214,
    plan: "mensual",
    expiresInDays: 16,
  },
  {
    name: "Bruno Ontiveros",
    email: "bruno.ontiveros@marafitness.app",
    joinedDaysAgo: 402,
    plan: "anual",
    expiresInDays: 128,
  },
  {
    name: "Camila Rentería",
    email: "camila.renteria@marafitness.app",
    joinedDaysAgo: 96,
    plan: "trimestral",
    expiresInDays: 4, // Vence esta semana: dispara el aviso del resumen.
  },
  {
    name: "Diego Palacios",
    email: "diego.palacios@marafitness.app",
    joinedDaysAgo: 61,
    plan: "mensual",
    expiresInDays: 22,
  },
  {
    name: "Elena Vidaurri",
    email: "elena.vidaurri@marafitness.app",
    joinedDaysAgo: 288,
    plan: "mensual",
    expiresInDays: -9, // Vencida: hay que verla marcada en rojo.
  },
  {
    name: "Fernando Quiroz",
    email: "fernando.quiroz@marafitness.app",
    joinedDaysAgo: 18,
    plan: "trimestral",
    expiresInDays: 72,
  },
  {
    name: "Gabriela Mondragón",
    email: "gabriela.mondragon@marafitness.app",
    joinedDaysAgo: 9, // Alta reciente: cuenta para "nuevos" del resumen.
    plan: "mensual",
    expiresInDays: 21,
  },
  {
    name: "Héctor Zamudio",
    email: "hector.zamudio@marafitness.app",
    joinedDaysAgo: 155,
    plan: null, // Sin membresía: pasa por recepción cuando puede.
    expiresInDays: 0,
  },
  {
    name: "Itzel Barragán",
    email: "itzel.barragan@marafitness.app",
    joinedDaysAgo: 5,
    plan: "visita",
    expiresInDays: 1,
  },
  {
    name: "Joaquín Treviño",
    email: "joaquin.trevino@marafitness.app",
    joinedDaysAgo: 340,
    plan: "anual",
    expiresInDays: 25,
  },
];
