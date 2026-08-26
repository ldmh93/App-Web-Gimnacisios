import type { Exercise, MuscleGroup } from "@/lib/types";
import { LIBRARY_EXERCISES } from "./exercises";

/**
 * Taxonomía muscular del mapa corporal interactivo.
 *
 * La app clasifica cada ejercicio con `group` (10 grupos amplios), pero el
 * cuerpo interactivo necesita más finura: "pierna" tiene que poder tocarse como
 * cuádriceps, femoral o pantorrillas por separado. En lugar de re-etiquetar los
 * ~680 ejercicios, cada región se resuelve con el músculo PRINCIPAL, que es
 * `muscles[0]` y particiona los grupos casi perfectamente (en pierna:
 * gemelos 46 / cuádriceps 34 / isquiotibiales 17 / aductores 3 = 100).
 *
 * Se compara por subcadena porque los ejercicios curados usan formas más ricas
 * ("Femoral (isquiotibiales)", "Erectores espinales") que las del dataset.
 */

export type BodyRegionId =
  | "pecho"
  | "hombro"
  | "biceps"
  | "triceps"
  | "antebrazo"
  | "abdomen"
  | "oblicuos"
  | "trapecio"
  | "dorsal"
  | "lumbar"
  | "gluteo"
  | "cuadriceps"
  | "femoral"
  | "gemelos";

export type BodyView = "front" | "back";

export interface BodyRegion {
  id: BodyRegionId;
  label: string;
  /** Nombre anatómico, para la ficha de la región. */
  anatomical: string;
  /** Vistas en las que la región es tocable. */
  views: BodyView[];
  /** Grupos de la taxonomía existente en los que puede aparecer. */
  groups: MuscleGroup[];
  /** Se busca en el músculo principal (`muscles[0]`). */
  primary?: string[];
  /** Se busca en el nombre del ejercicio. Complementa a `primary`. */
  nameKeywords?: string[];
  /** Descarta el ejercicio si aparece en el nombre o en el principal. */
  exclude?: string[];
  /** Indicación breve que se muestra al seleccionar la zona. */
  hint: string;
}

export const BODY_REGIONS: BodyRegion[] = [
  {
    id: "pecho",
    label: "Pecho",
    anatomical: "Pectoral mayor y menor",
    views: ["front"],
    groups: ["pecho"],
    hint: "Empujes horizontales: press, fondos y aperturas.",
  },
  {
    id: "hombro",
    label: "Hombros",
    anatomical: "Deltoides anterior, lateral y posterior",
    views: ["front", "back"],
    groups: ["hombro"],
    exclude: ["encogimiento"],
    hint: "Empujes verticales y elevaciones laterales.",
  },
  {
    id: "biceps",
    label: "Bíceps",
    anatomical: "Bíceps braquial y braquial anterior",
    views: ["front"],
    groups: ["biceps"],
    primary: ["biceps", "braquial"],
    hint: "Flexión de codo: el curl en todas sus variantes.",
  },
  {
    id: "triceps",
    label: "Tríceps",
    anatomical: "Tríceps braquial (3 cabezas)",
    views: ["back"],
    groups: ["triceps"],
    hint: "Extensión de codo: fondos, press francés y jalones.",
  },
  {
    id: "antebrazo",
    label: "Antebrazos",
    anatomical: "Flexores y extensores del antebrazo",
    views: ["front", "back"],
    groups: ["biceps", "triceps"],
    primary: ["antebrazo", "muñeca"],
    hint: "Agarre y muñeca. Suelen entrenarse al final de la sesión.",
  },
  {
    id: "abdomen",
    label: "Abdomen",
    anatomical: "Recto abdominal y transverso",
    views: ["front"],
    groups: ["abdomen"],
    primary: ["recto abdominal", "transverso", "abdominal"],
    exclude: ["oblicuo", "leñador", "ruso"],
    hint: "Flexión de tronco y anti-extensión: crunch y plancha.",
  },
  {
    id: "oblicuos",
    label: "Oblicuos",
    anatomical: "Oblicuo externo e interno",
    views: ["front"],
    groups: ["abdomen"],
    primary: ["oblicuo"],
    nameKeywords: ["oblicuo", "lateral", "ruso", "leñador", "rotacion", "giro"],
    hint: "Rotación y flexión lateral del tronco.",
  },
  {
    id: "trapecio",
    label: "Trapecio",
    anatomical: "Trapecio superior, medio e inferior",
    views: ["back"],
    groups: ["espalda", "hombro"],
    primary: ["trapecio", "romboides"],
    nameKeywords: ["encogimiento"],
    hint: "Encogimientos y remos altos.",
  },
  {
    id: "dorsal",
    label: "Dorsales",
    anatomical: "Dorsal ancho y redondo mayor",
    views: ["back"],
    groups: ["espalda"],
    primary: ["dorsal", "espalda alta", "redondo"],
    nameKeywords: ["jalon", "remo", "dominada", "pullover"],
    exclude: ["encogimiento"],
    hint: "Jalones y remos: los que dan anchura a la espalda.",
  },
  {
    id: "lumbar",
    label: "Lumbares",
    anatomical: "Erectores espinales",
    views: ["back"],
    groups: ["espalda", "pierna", "gluteo"],
    primary: ["lumbar", "erector", "espinal", "columna"],
    nameKeywords: [
      "hiperextension",
      "peso muerto",
      "buenos dias",
      "extension de tronco",
      "extension lumbar",
    ],
    hint: "Extensión de cadera y columna. Técnica antes que carga.",
  },
  {
    id: "gluteo",
    label: "Glúteos",
    anatomical: "Glúteo mayor, medio y menor",
    views: ["back"],
    groups: ["gluteo"],
    hint: "Extensión de cadera: hip thrust, puentes y zancadas.",
  },
  {
    id: "cuadriceps",
    label: "Cuádriceps",
    anatomical: "Recto femoral, vastos y aductores",
    views: ["front"],
    groups: ["pierna"],
    primary: ["cuadriceps", "aductor"],
    hint: "Dominantes de rodilla: sentadillas, prensa y extensiones.",
  },
  {
    id: "femoral",
    label: "Femoral",
    anatomical: "Isquiotibiales",
    views: ["back"],
    groups: ["pierna", "gluteo"],
    primary: ["isquiotibial", "femoral"],
    nameKeywords: ["rumano", "curl femoral", "buenos dias"],
    hint: "Dominantes de cadera: curl femoral y peso muerto rumano.",
  },
  {
    id: "gemelos",
    label: "Pantorrillas",
    anatomical: "Gastrocnemio y sóleo",
    views: ["back"],
    groups: ["pierna"],
    primary: ["gemelo", "soleo", "pantorrilla"],
    hint: "Elevaciones de talón: rango completo y repeticiones altas.",
  },
];

export function bodyRegion(id: BodyRegionId): BodyRegion | undefined {
  return BODY_REGIONS.find((r) => r.id === id);
}

export function regionsForView(view: BodyView): BodyRegion[] {
  return BODY_REGIONS.filter((r) => r.views.includes(view));
}

/** Quita acentos y pasa a minúsculas para comparar sin sorpresas. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesRegion(exercise: Exercise, region: BodyRegion): boolean {
  if (!region.groups.includes(exercise.group)) return false;

  const name = normalize(exercise.name);
  const primary = normalize(exercise.muscles[0] ?? "");

  if (
    region.exclude?.some(
      (word) =>
        name.includes(normalize(word)) || primary.includes(normalize(word))
    )
  ) {
    return false;
  }

  // Sin filtros finos, la región se queda con el grupo entero.
  if (!region.primary && !region.nameKeywords) return true;

  const primaryHit =
    region.primary?.some((word) => primary.includes(normalize(word))) ?? false;
  const nameHit =
    region.nameKeywords?.some((word) => name.includes(normalize(word))) ?? false;

  return primaryHit || nameHit;
}

/** Ejercicios de una región, curados primero (sus fichas son más completas). */
export function exercisesForRegion(id: BodyRegionId): Exercise[] {
  const region = bodyRegion(id);
  if (!region) return [];
  return LIBRARY_EXERCISES.filter((e) => matchesRegion(e, region));
}

/** Nº de ejercicios por región, para las etiquetas del mapa. */
export function regionCounts(): Record<BodyRegionId, number> {
  const counts = {} as Record<BodyRegionId, number>;
  for (const region of BODY_REGIONS) {
    counts[region.id] = exercisesForRegion(region.id).length;
  }
  return counts;
}
