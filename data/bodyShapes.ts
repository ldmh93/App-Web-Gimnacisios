import type { BodyRegionId, BodyView } from "./muscleMap";

/**
 * Geometría del cuerpo interactivo.
 *
 * El dibujo lo pone una ilustración anatómica real (public/body/*.png, con el
 * fondo recortado); este módulo solo define las ZONAS TOCABLES trazadas encima,
 * en el sistema de coordenadas de cada imagen.
 *
 * Convenciones:
 * - Cada vista tiene su propio lienzo y su eje de simetría (`axis`).
 * - Los músculos pares se trazan SOLO en su mitad izquierda; el componente
 *   pinta la copia derecha reflejándolos sobre `axis`. Así la simetría es
 *   exacta y hay la mitad de trazados que mantener.
 * - `paired: false` marca las zonas centrales (abdomen, trapecio, lumbares),
 *   que ya cruzan el eje y no deben reflejarse.
 */

export interface BodyImage {
  src: string;
  /** Silueta blanca sobre negro: recorta el resaltado al contorno del cuerpo. */
  mask: string;
  width: number;
  height: number;
  /** Eje vertical de simetría, en coordenadas de la imagen. */
  axis: number;
}

export const BODY_IMAGE: Record<BodyView, BodyImage> = {
  front: {
    src: "/body/front.webp",
    mask: "/body/front-mask.png",
    width: 820,
    height: 1677,
    axis: 410,
  },
  back: {
    src: "/body/back.webp",
    mask: "/body/back-mask.png",
    width: 820,
    height: 1609,
    axis: 410,
  },
};

export interface RegionShape {
  d: string;
  paired: boolean;
}

/** Transformación que refleja un músculo par sobre el eje de su vista. */
export function mirrorTransform(axis: number): string {
  return `matrix(-1 0 0 1 ${axis * 2} 0)`;
}

export const REGION_SHAPES: Record<
  BodyView,
  Partial<Record<BodyRegionId, RegionShape>>
> = {
  front: {
    hombro: {
      d: "M248,305 C206,296 164,326 148,378 C140,416 156,448 188,450 C216,436 238,398 248,350 Z",
      paired: true,
    },
    pecho: {
      d: "M405,310 L282,300 C250,321 237,371 245,416 C266,451 331,463 405,451 Z",
      paired: true,
    },
    biceps: {
      d: "M212,424 C172,434 138,468 124,514 C118,550 137,574 164,569 C190,546 207,490 213,441 Z",
      paired: true,
    },
    antebrazo: {
      d: "M164,572 C126,596 92,652 74,720 C64,768 70,814 93,828 C121,822 144,776 158,714 C172,652 174,604 174,576 Z",
      paired: true,
    },
    abdomen: {
      d: "M326,458 L494,458 C502,542 501,640 487,718 C468,776 440,800 410,803 C381,800 352,776 333,718 C319,640 318,542 326,458 Z",
      paired: false,
    },
    oblicuos: {
      d: "M322,478 C301,486 283,514 277,572 C273,648 285,724 307,784 L322,776 C312,700 309,584 322,478 Z",
      paired: true,
    },
    cuadriceps: {
      d: "M336,812 C297,806 258,830 236,882 C216,942 214,1030 230,1098 C246,1138 287,1146 307,1116 C319,1044 330,928 336,856 Z",
      paired: true,
    },
  },
  back: {
    trapecio: {
      d: "M410,190 L376,204 C338,232 300,272 280,312 C310,352 350,410 384,442 L410,448 L436,442 C470,410 510,352 540,312 C520,272 482,232 444,204 Z",
      paired: false,
    },
    hombro: {
      d: "M256,306 C212,298 172,328 156,378 C148,414 164,444 194,446 C222,432 245,394 256,346 Z",
      paired: true,
    },
    triceps: {
      d: "M210,425 C172,437 138,472 124,516 C118,552 137,576 164,571 C190,548 206,494 212,443 Z",
      paired: true,
    },
    antebrazo: {
      d: "M164,575 C126,600 92,656 74,724 C64,772 70,818 93,832 C121,826 144,780 158,718 C172,656 174,606 174,578 Z",
      paired: true,
    },
    dorsal: {
      d: "M400,410 C352,418 308,436 276,474 C252,508 245,552 258,588 C288,626 344,642 400,630 Z",
      paired: true,
    },
    lumbar: {
      d: "M340,600 C364,591 456,591 480,600 C476,646 462,678 440,692 L382,692 C360,678 345,646 340,600 Z",
      paired: false,
    },
    gluteo: {
      d: "M402,706 C354,698 306,708 280,744 C258,784 258,838 282,868 C318,894 374,890 402,868 Z",
      paired: true,
    },
    femoral: {
      d: "M334,900 C296,895 258,918 238,964 C219,1018 219,1094 237,1144 C259,1176 298,1171 316,1136 C329,1068 336,980 338,926 Z",
      paired: true,
    },
    gemelos: {
      d: "M310,1186 C275,1181 243,1204 228,1249 C219,1303 228,1357 250,1384 C281,1397 302,1375 306,1330 C310,1276 312,1222 312,1195 Z",
      paired: true,
    },
  },
};
