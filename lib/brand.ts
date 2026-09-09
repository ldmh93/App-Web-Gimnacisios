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
   * Colores de los textos de marca, en hexadecimal.
   * Vacío = hereda el color del tema, que es el comportamiento por defecto y
   * lo que mantiene el contraste correcto en claro y oscuro.
   */
  nameColor: string;
  accentColor: string;
  taglineColor: string;
}

/**
 * Identidad por defecto: el producto se llama FIT CORE y arranca con el
 * emblema que ya estaba en el proyecto.
 */
export const DEFAULT_BRAND: BrandConfig = {
  name: "FIT",
  nameAccent: "CORE",
  mark: "/brand/mark.png",
  logo: "/brand/logo.png",
  splash: "",
  tagline: "Transforma tu cuerpo. Construye tu mejor versión.",
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
