/**
 * Identidad de marca configurable.
 *
 * El nombre y el logotipo dejan de estar escritos a fuego en los componentes y
 * pasan a ser DATOS editables desde /admin. Así la misma aplicación puede
 * presentarse a varios gimnasios con su propia identidad sin tocar código.
 *
 * El logotipo admite tanto una ruta de `public/` como un data URL subido desde
 * el panel; por eso las imágenes de marca se pintan con <img> y no con
 * next/image, que exige rutas conocidas en tiempo de compilación.
 */

export interface BrandConfig {
  /** Nombre corto que aparece en el header, el carnet y los metadatos. */
  name: string;
  /** Segunda palabra, resaltada en color. Vacío si el nombre es de una pieza. */
  nameAccent: string;
  /** Isotipo cuadrado: ruta pública o data URL. */
  mark: string;
  /** Logotipo completo con lettering, para la portada. */
  logo: string;
  /**
   * Imagen de la presentación (splash) y de la pantalla de acceso.
   * Vacío = se reutiliza el isotipo, que es el comportamiento por defecto.
   */
  splash: string;
  /** Frase de la portada. */
  tagline: string;
  /**
   * Color de acento de TODA la interfaz: botones, enlaces, resaltados del mapa
   * muscular, gráficas. Vacío = el rojo del tema.
   */
  primaryColor: string;
  /**
   * Colores de los textos de marca, en hexadecimal.
   * Vacío = hereda el color del tema, que es el comportamiento por defecto y
   * lo que mantiene el contraste correcto en claro y oscuro.
   */
  nameColor: string;
  accentColor: string;
  taglineColor: string;
}

/**
 * Identidad por defecto del producto.
 *
 * Las imágenes son propias de FIT CORE. Antes se reutilizaban las de MORA'S
 * GYM, pero el logotipo grande lleva ESE nombre escrito dentro y chocaba con
 * el "FIT CORE" del header. Las de MORA'S siguen en /brand/mark.png y
 * /brand/logo.png: se pueden volver a poner desde Configuración cuando se
 * presente la app a ese gimnasio.
 */
export const DEFAULT_BRAND: BrandConfig = {
  name: "FIT",
  nameAccent: "CORE",
  mark: "/brand/fitcore-mark.png",
  logo: "/brand/fitcore-logo.png",
  splash: "",
  tagline: "Transforma tu cuerpo. Construye tu mejor versión.",
  primaryColor: "",
  nameColor: "",
  accentColor: "",
  taglineColor: "",
};

/**
 * Color de un texto de marca, o undefined para que herede el del tema.
 * Se devuelve undefined (y no una cadena vacía) porque React omite la
 * propiedad CSS, dejando que mande la clase de Tailwind.
 */
export function brandColor(value: string | undefined): string | undefined {
  return value ? value : undefined;
}

/**
 * Imagen para la presentación y el acceso.
 *
 * Se resuelve con respaldo para que una configuración guardada antes de que
 * existiera esta ranura (sin el campo `splash`) siga funcionando.
 */
export function splashImage(brand: BrandConfig): string {
  return brand.splash || brand.mark;
}

/** Nombre completo para textos corridos, metadatos y correos. */
export function brandName(brand: BrandConfig): string {
  return [brand.name, brand.nameAccent].filter(Boolean).join(" ").trim();
}

/**
 * Comprime una imagen elegida por el administrador antes de guardarla.
 *
 * LocalStorage ronda los 5 MB para TODO el dominio, así que meter un PNG
 * original de 1 MB dejaría sin sitio al resto de datos del usuario. Se
 * reescala y se pasa a WebP con calidad media: un logo queda en pocas decenas
 * de KB sin pérdida apreciable a los tamaños en que se muestra.
 */
export async function compressImage(
  file: File,
  maxSize = 512,
  quality = 0.82
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("El archivo no es una imagen válida"));
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl; // Sin canvas, se guarda tal cual antes que fallar.
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // WebP conserva la transparencia del logo; si el navegador no lo soporta,
  // toDataURL devuelve PNG y sigue funcionando.
  return canvas.toDataURL("image/webp", quality);
}

/** Tamaño aproximado en KB de un data URL, para avisar al administrador. */
export function dataUrlSizeKb(dataUrl: string): number {
  if (!dataUrl.startsWith("data:")) return 0;
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.round((base64.length * 0.75) / 1024);
}

/* ------------------------- Color principal de la app ---------------------- */

/**
 * El color de acento de toda la interfaz (`--primary`) vive en globals.css con
 * un rojo fijo. Estas funciones permiten sustituirlo por el color del gimnasio
 * y, sobre todo, DEDUCIRLO del logotipo que suba el administrador: así la app
 * entera queda en armonía con la marca sin pedirle que acierte un hexadecimal.
 */

/** Convierte "#rrggbb" a sus componentes. Devuelve null si no es válido. */
function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/**
 * Blanco o negro según lo que se lea mejor encima del color dado.
 * Usa la luminancia relativa de WCAG, no el promedio de los canales: el ojo es
 * mucho más sensible al verde, y promediar da resultados ilegibles.
 */
export function readableForeground(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "#ffffff";
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
  return luminance > 0.45 ? "#111111" : "#ffffff";
}

/**
 * Deduce el color de acento de una imagen.
 *
 * Descarta lo transparente, lo casi blanco, lo casi negro y lo desaturado —que
 * en un logotipo suele ser el contorno o el fondo— y se queda con el tono
 * cromático dominante. Si el logo es puramente monocromo devuelve null, porque
 * inventarle un color sería peor que dejar el del tema.
 *
 * Del tono ganador se toma el PROMEDIO y no el píxel más saturado: probado
 * contra los logotipos reales, el más saturado devuelve el rojo de las sombras
 * (#8e0000) en vez del rojo de marca (#c55451). El promedio sale algo más
 * apagado, que además le sienta bien a un acento de interfaz.
 */
export async function extractAccentColor(src: string): Promise<string | null> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = src;
  });

  const size = 72; // Suficiente para el tono dominante y muy barato de recorrer.
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, size, size);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, size, size).data;
  } catch {
    return null; // Lienzo contaminado por una imagen de otro origen.
  }

  // 24 cubos de tono (15° cada uno) con la suma de sus colores.
  const buckets = Array.from({ length: 24 }, () => ({
    count: 0,
    r: 0,
    g: 0,
    b: 0,
  }));

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 128) continue;

    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const lightness = (max + min) / 2;
    if (lightness < 0.12 || lightness > 0.9) continue; // negro y blanco fuera

    const delta = max - min;
    const saturation =
      delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    if (saturation < 0.28) continue; // grises fuera

    // Tono en grados
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    let hue: number;
    if (max === rn) hue = ((gn - bn) / delta) % 6;
    else if (max === gn) hue = (bn - rn) / delta + 2;
    else hue = (rn - gn) / delta + 4;
    hue = (hue * 60 + 360) % 360;

    const bucket = buckets[Math.floor(hue / 15)];
    bucket.count++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
  }

  const best = buckets.reduce((a, b) => (b.count > a.count ? b : a));
  // Con muy pocos píxeles cromáticos el resultado sería ruido, no la marca.
  if (best.count < 12) return null;

  return toHex(best.r / best.count, best.g / best.count, best.b / best.count);
}
