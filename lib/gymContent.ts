import { GYM_INFO } from "@/data/gym";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/storage";

/**
 * Contenido del gimnasio administrable desde /admin.
 *
 * Los valores por defecto siguen viniendo de data/gym.ts y de las fotos que ya
 * había en public/gym/. Lo que se guarda aquí es la CAPA DE EDICIÓN encima:
 * si el administrador no toca nada, la aplicación se comporta exactamente como
 * antes. Así se añade la administración sin romper lo que ya funcionaba.
 */

/* --------------------------------- Fotos --------------------------------- */

export interface GymPhoto {
  id: string;
  /** Ruta pública o data URL subido desde el panel. */
  src: string;
  title: string;
  description: string;
  hidden: boolean;
}

/** Fotos que ya existían en public/gym/, por convención de nombre. */
export const DEFAULT_PHOTOS: GymPhoto[] = Array.from({ length: 8 }, (_, i) => ({
  id: `foto-${i + 1}`,
  src: `/gym/foto-${i + 1}.jpg`,
  title: "",
  description: "",
  hidden: false,
}));

export function loadPhotos(): GymPhoto[] {
  return loadFromStorage<GymPhoto[]>(STORAGE_KEYS.gymPhotos, DEFAULT_PHOTOS);
}

export function savePhotos(photos: GymPhoto[]): void {
  saveToStorage(STORAGE_KEYS.gymPhotos, photos);
}

/** Solo las visibles, que es lo que ve el socio. */
export function visiblePhotos(): GymPhoto[] {
  return loadPhotos().filter((p) => !p.hidden);
}

/* ------------------------- Información del gimnasio ----------------------- */

export interface EditableGymInfo {
  name: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  /** Textos de presentación, nuevos y opcionales. */
  history: string;
  philosophy: string;
}

export const DEFAULT_GYM_INFO: EditableGymInfo = {
  ...GYM_INFO,
  history:
    "Abrimos con una idea sencilla: un gimnasio donde cualquiera se sienta acompañado desde el primer día, entrene por primera vez o lleve años levantando.",
  philosophy:
    "La constancia gana a la intensidad. Preferimos que vengas tres días bien a que vengas uno a reventarte y desaparezcas dos semanas.",
};

export function loadGymInfo(): EditableGymInfo {
  return loadFromStorage<EditableGymInfo>(
    STORAGE_KEYS.gymInfo,
    DEFAULT_GYM_INFO
  );
}

export function saveGymInfo(info: EditableGymInfo): void {
  saveToStorage(STORAGE_KEYS.gymInfo, info);
}

/* -------------------------------- Nutriólogo ------------------------------ */

export interface Nutritionist {
  name: string;
  /** Ruta pública o data URL. Vacío = se muestra la inicial. */
  photo: string;
  specialty: string;
  bio: string;
  services: string[];
  schedule: string;
  phone: string;
  email: string;
  /** Consejos generales, nunca presentados como diagnóstico. */
  tips: string[];
}

export const DEFAULT_NUTRITIONIST: Nutritionist = {
  name: "Valeria Fuentes",
  photo: "",
  specialty: "Nutrición deportiva",
  bio: "Acompaño a socios de todos los niveles a ordenar su alimentación según su objetivo, sin dietas imposibles de sostener.",
  services: [
    "Valoración inicial y composición corporal",
    "Plan de alimentación personalizado",
    "Revisión y ajuste mensual",
    "Orientación sobre suplementación",
  ],
  schedule: "Lunes a viernes, 9:00 a 14:00 y 17:00 a 20:00",
  phone: GYM_INFO.phone,
  email: GYM_INFO.email,
  tips: [
    "Reparte la proteína entre todas las comidas del día, no solo en la cena.",
    "Bebe agua durante el entrenamiento, no solo al terminar.",
    "Una comida fuera de plan no arruina la semana: lo que cuenta es el promedio.",
  ],
};

export function loadNutritionist(): Nutritionist {
  return loadFromStorage<Nutritionist>(
    STORAGE_KEYS.nutritionist,
    DEFAULT_NUTRITIONIST
  );
}

export function saveNutritionist(n: Nutritionist): void {
  saveToStorage(STORAGE_KEYS.nutritionist, n);
}
