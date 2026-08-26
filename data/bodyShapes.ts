import type { BodyRegionId, BodyView } from "./muscleMap";

/**
 * Geometría del cuerpo interactivo.
 *
 * Convenciones:
 * - Lienzo 220 x 470, figura centrada en x = 110, proporción ~7,5 cabezas.
 * - Los músculos pares se dibujan SOLO en su mitad izquierda; el componente
 *   pinta la copia derecha con `matrix(-1 0 0 1 220 0)`. La simetría queda
 *   garantizada y hay la mitad de trazados que mantener.
 * - `paired: false` marca las zonas centrales (abdomen, trapecio, lumbares),
 *   que ya cruzan el eje y no deben espejarse.
 * - BODY_BASE es una silueta continua que se pinta DEBAJO de los músculos: así
 *   las juntas entre grupos musculares muestran cuerpo y no fondo.
 */

export const BODY_CANVAS = { width: 220, height: 470 } as const;

export interface RegionShape {
  d: string;
  paired: boolean;
}

/** Silueta continua no interactiva (cabeza, cuello, tronco, extremidades). */
export const BODY_BASE: Record<BodyView, RegionShape[]> = {
  front: [
    { d: "M110,16 C98,16 90,27 90,42 C90,57 98,68 110,68 L110,16 Z", paired: true },
    { d: "M110,62 L100,65 L98,86 L110,88 Z", paired: true },
    { d: "M110,84 L86,88 C72,94 64,106 63,120 C62,138 70,158 76,178 C79,194 82,206 87,214 L110,220 Z", paired: true },
    { d: "M63,105 C52,115 46,137 45,163 C45,178 57,181 62,168 C66,148 68,122 69,107 Z", paired: true },
    { d: "M45,165 C41,189 38,212 38,234 C40,247 53,248 55,235 C57,213 61,187 63,166 Z", paired: true },
    { d: "M38,236 C32,247 32,265 39,274 C48,278 55,271 55,259 C55,249 51,239 48,236 Z", paired: true },
    { d: "M110,220 L84,215 C75,244 73,288 79,330 L108,334 Z", paired: true },
    { d: "M79,328 L107,332 L104,410 L85,410 Z", paired: true },
    { d: "M85,408 L104,408 L109,426 L78,426 Z", paired: true },
  ],
  back: [
    { d: "M110,16 C98,16 90,27 90,42 C90,57 98,68 110,68 L110,16 Z", paired: true },
    { d: "M110,62 L100,65 L98,86 L110,88 Z", paired: true },
    { d: "M110,84 L86,88 C72,94 64,106 63,120 C62,138 70,158 76,178 C79,194 82,206 87,214 L110,220 Z", paired: true },
    { d: "M63,105 C52,115 46,137 45,163 C45,178 57,181 62,168 C66,148 68,122 69,107 Z", paired: true },
    { d: "M45,165 C41,189 38,212 38,234 C40,247 53,248 55,235 C57,213 61,187 63,166 Z", paired: true },
    { d: "M38,236 C32,247 32,265 39,274 C48,278 55,271 55,259 C55,249 51,239 48,236 Z", paired: true },
    { d: "M110,220 L84,215 C75,244 73,288 79,330 L108,334 Z", paired: true },
    { d: "M79,328 L107,332 L104,410 L85,410 Z", paired: true },
    { d: "M85,408 L104,408 L109,426 L78,426 Z", paired: true },
  ],
};

export const REGION_SHAPES: Record<
  BodyView,
  Partial<Record<BodyRegionId, RegionShape>>
> = {
  front: {
    hombro: { d: "M86,88 C72,94 64,106 63,121 C70,129 82,125 88,113 C91,103 89,93 86,88 Z", paired: true },
    pecho: { d: "M110,92 L88,97 C82,110 82,126 88,138 C97,144 106,143 110,139 Z", paired: true },
    biceps: { d: "M64,123 C56,133 52,150 51,166 C57,175 66,172 69,161 C72,146 70,132 69,122 Z", paired: true },
    antebrazo: { d: "M51,168 C47,189 44,210 44,230 C50,238 58,234 58,224 C60,204 63,185 65,169 Z", paired: true },
    abdomen: { d: "M110,140 L97,144 L95,170 L98,198 L110,205 L122,198 L125,170 L123,144 Z", paired: false },
    oblicuos: { d: "M95,146 L88,152 C86,168 89,188 95,199 L97,196 Z", paired: true },
    cuadriceps: { d: "M110,222 L85,218 C78,246 77,286 83,320 C94,326 105,322 107,310 Z", paired: true },
  },
  back: {
    trapecio: { d: "M110,70 L94,78 L83,96 L92,128 L110,134 L128,128 L137,96 L126,78 Z", paired: false },
    hombro: { d: "M86,88 C72,94 64,106 63,121 C70,129 82,125 88,113 C91,103 89,93 86,88 Z", paired: true },
    triceps: { d: "M64,123 C56,133 52,150 51,166 C57,175 66,172 69,161 C72,146 70,132 69,122 Z", paired: true },
    antebrazo: { d: "M51,168 C47,189 44,210 44,230 C50,238 58,234 58,224 C60,204 63,185 65,169 Z", paired: true },
    dorsal: { d: "M110,134 L91,130 C80,142 76,170 84,198 L110,203 Z", paired: true },
    lumbar: { d: "M110,201 L96,198 L91,218 L110,224 L129,218 L124,198 Z", paired: false },
    gluteo: { d: "M110,224 L88,220 C78,229 76,248 86,261 C98,267 108,262 110,251 Z", paired: true },
    femoral: { d: "M110,263 L86,260 C79,284 78,310 85,330 C96,335 105,330 107,318 Z", paired: true },
    gemelos: { d: "M107,334 L85,331 C78,346 78,370 86,385 C98,389 104,382 104,371 Z", paired: true },
  },
};

/** Transformación que genera la copia derecha de un músculo par. */
export const MIRROR = "matrix(-1 0 0 1 220 0)";
