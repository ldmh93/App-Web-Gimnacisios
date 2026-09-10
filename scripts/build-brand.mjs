import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { basename } from "node:path";

/**
 * Genera las piezas de marca a partir de un logotipo original.
 *
 *   node scripts/build-brand.mjs public/brand/origen/mara-fitness.png mara
 *
 * De un solo archivo salen las tres piezas que usa la aplicación, porque cada
 * sitio necesita algo distinto:
 *
 *   <slug>-mark.png    Isotipo cuadrado. Header, carnet, perfil y panel. Se
 *                      recorta la parte gráfica del logotipo: el lockup
 *                      completo a 36 px sería ilegible.
 *   <slug>-logo.png    Logotipo sobre placa oscura. Va con placa porque muchos
 *                      logotipos llevan texto blanco, que desaparecería en el
 *                      tema claro.
 *   <slug>-splash.png  El original tal cual, para la presentación y el acceso,
 *                      cuyo fondo ya es oscuro.
 *
 * Los originales se guardan en public/brand/origen/ y SÍ se versionan: son la
 * fuente de la que todo lo demás se puede rehacer.
 */

const [, , source, slugArg] = process.argv;

if (!source || !existsSync(source)) {
  console.error(
    "Uso: node scripts/build-brand.mjs <ruta-del-logotipo> [slug]\n" +
      "Ejemplo: node scripts/build-brand.mjs public/brand/origen/mara-fitness.png mara"
  );
  process.exit(1);
}

const slug = slugArg ?? basename(source).replace(/\.[a-z]+$/i, "");
const OUT = "public/brand";
mkdirSync(OUT, { recursive: true });

/** Placa oscura redondeada con un filo del color de la marca. */
function plate(w, h, radius, accent) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="g" cx="50%" cy="38%" r="72%">
        <stop offset="0%" stop-color="#1e1c14"/>
        <stop offset="100%" stop-color="#0c0c10"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" rx="${radius}" fill="url(#g)"/>
    <rect x="${radius * 0.09}" y="${radius * 0.09}"
          width="${w - radius * 0.18}" height="${h - radius * 0.18}"
          rx="${radius * 0.92}" fill="none"
          stroke="${accent}" stroke-opacity="0.3" stroke-width="${Math.max(4, Math.round(h / 70))}"/>
  </svg>`);
}

/** Color de marca dominante, para el filo de la placa. */
async function accentOf(file) {
  const { data, info } = await sharp(file)
    .resize(72, 72, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const c = info.channels;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += c) {
    const [R, G, B, A] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (A < 128) continue;
    const max = Math.max(R, G, B) / 255;
    const min = Math.min(R, G, B) / 255;
    const l = (max + min) / 2;
    if (l < 0.12 || l > 0.9) continue;
    const d = max - min;
    if (d === 0 || d / (1 - Math.abs(2 * l - 1)) < 0.28) continue;
    r += R; g += G; b += B; n++;
  }
  if (!n) return "#888888";
  const hex = (v) => Math.round(v / n).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Zona gráfica del logotipo: el bloque opaco que queda por encima del texto.
 * Se busca la franja horizontal más alta con contenido; en un lockup con el
 * icono arriba, eso es el icono.
 */
async function graphicBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const rowHas = [];
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (data[(y * W + x) * C + 3] > 40) n++;
    rowHas.push(n);
  }
  // El lettering es la franja más ancha. Desde ahí se sube hasta encontrar el
  // HUECO que lo separa del icono; cortar unos píxeles por encima no basta,
  // porque las letras siguen ahí y el isotipo sale con texto diminuto pegado.
  const widest = rowHas.indexOf(Math.max(...rowHas));
  const empty = (n) => n <= W * 0.004;
  let limit = 0;
  for (let y = widest; y > 0; y--) {
    if (empty(rowHas[y])) {
      limit = y;
      break;
    }
  }
  // Sin hueco (icono y texto pegados) no se puede aislar el icono con
  // seguridad: se prefiere usar el logotipo entero antes que recortar a ciegas.
  if (limit < H * 0.08) return null;
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < limit; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  // Sin zona gráfica clara (logotipo solo de texto), se usa el logotipo entero.
  if (maxX <= minX || maxY <= minY) return null;
  const pad = 12;
  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(W, maxX - minX + pad * 2),
    height: Math.min(H, maxY - minY + pad * 2),
  };
}

const accent = await accentOf(source);
const box = await graphicBox(source);

/* --- Isotipo --- */
const iconSource = box ? await sharp(source).extract(box).toBuffer() : source;
const icon = await sharp(iconSource).resize({ width: 330, height: 330, fit: "inside" }).toBuffer();
const iconMeta = await sharp(icon).metadata();
await sharp(plate(512, 512, 116, accent))
  .composite([
    {
      input: icon,
      left: Math.round((512 - (iconMeta.width ?? 0)) / 2),
      top: Math.round((512 - (iconMeta.height ?? 0)) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/${slug}-mark.png`);

/* --- Logotipo sobre placa --- */
const lock = await sharp(source).resize({ width: 1180 }).toBuffer();
const lockMeta = await sharp(lock).metadata();
const PW = 1400;
const PH = Math.max(560, (lockMeta.height ?? 400) + 220);
await sharp(plate(PW, PH, 120, accent))
  .composite([
    {
      input: lock,
      left: Math.round((PW - (lockMeta.width ?? 0)) / 2),
      top: Math.round((PH - (lockMeta.height ?? 0)) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/${slug}-logo.png`);

/* --- Presentación --- */
await sharp(source)
  .resize({ width: 1180 })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/${slug}-splash.png`);

console.log(`Marca "${slug}" generada desde ${source}`);
console.log(`  color detectado: ${accent}`);
console.log(`  ${slug}-mark.png · ${slug}-logo.png · ${slug}-splash.png`);
console.log(
  "\nPara usarla, apunta DEFAULT_BRAND en lib/brand.ts a esas rutas,\n" +
    "o súbela desde el panel en Configuración."
);
