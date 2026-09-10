# Marca y recursos gráficos

La identidad visual son **datos**, no constantes en el código. Así la misma
aplicación se presenta a varios gimnasios sin tocar una línea.

## Dónde vive cada cosa

```
public/brand/
  origen/              Logotipos ORIGINALES. Se versionan: son la fuente
    mara-fitness.png   de la que se puede rehacer todo lo demás.
  mara-mark.png        Isotipo cuadrado (header, carnet, perfil, panel)
  mara-logo.png        Logotipo sobre placa (portada)
  mara-splash.png      Original tal cual (presentación y acceso)
  fitcore-*.png        Lo mismo para la marca del producto
app/
  icon.png             Favicon
  apple-icon.png       Icono de iOS
  opengraph-image.png  Tarjeta al compartir el enlace
```

> Guarda siempre el original en `public/brand/origen/`. Antes el logotipo de
> MARA FITNESS solo existía en la carpeta de Descargas del equipo: si se
> borraba, no había de qué regenerar.

## Cambiar el logotipo de un gimnasio

### Opción A — desde la aplicación (sin tocar código)

1. Entra como administrador.
2. **Configuración → Identidad de marca**.
3. Sube las imágenes en las tres ranuras:
   - **Isotipo**: cuadrado, para tamaños pequeños.
   - **Presentación y acceso**: admite logotipo alargado. Opcional; si se deja
     vacía hereda el isotipo.
   - **Logotipo completo**: para la portada.
4. El color principal se deduce del logotipo automáticamente. Se puede
   sobrescribir a mano.
5. **Guardar esta marca** la añade a la biblioteca para recuperarla luego.

Se guarda en el navegador de quien lo configura. **No cambia lo que ve quien
abre el enlace publicado**: para eso hay que hacer la opción B.

### Opción B — por defecto para todos

1. Copia el logotipo original a `public/brand/origen/`.
2. Genera las tres piezas:

   ```bash
   node scripts/build-brand.mjs public/brand/origen/tu-logo.png slug
   ```

3. Apunta `DEFAULT_BRAND` en `lib/brand.ts` a `/brand/slug-mark.png`,
   `/brand/slug-logo.png` y `/brand/slug-splash.png`.
4. Actualiza los metadatos de `app/layout.tsx` (título y tarjeta al compartir).
5. Regenera favicon y tarjeta si quieres que también lleven la marca nueva.

## Por qué tres piezas y no una

Cada sitio necesita algo distinto, y usar el mismo archivo en todos falla:

- Un lockup horizontal a 36 px en el header es una mancha ilegible → hace falta
  un isotipo cuadrado.
- Muchos logotipos llevan texto blanco, que **desaparece en tema claro** → el
  logotipo grande va sobre placa oscura.
- La presentación ya tiene fondo oscuro, así que ahí el original luce mejor sin
  placa.

`scripts/build-brand.mjs` genera las tres desde el original. Para aislar el
icono busca el **hueco** entre la parte gráfica y el lettering; cortar unos
píxeles por encima del texto deja letras diminutas pegadas y el isotipo sale
ilegible.

## Colores

`BrandConfig` guarda:

| Campo | Efecto |
|---|---|
| `primaryColor` | Acento de **toda** la interfaz: botones, mapa muscular, gráficas |
| `nameColor`, `accentColor` | Las dos palabras del nombre |
| `taglineColor` | Titular de la portada |

Vacío significa «hereda del tema», que es lo seguro: mantiene el contraste en
claro y en oscuro. Un color fijo es el mismo en ambos temas, así que conviene
comprobarlo.

`primaryColor` se escribe sobre `--primary` en el elemento raíz, mandando sobre
`globals.css`. El texto encima se recalcula con luminancia WCAG: con un acento
claro pasa a oscuro solo, porque el blanco sería ilegible.

## Regla al añadir imágenes

Los logotipos se pintan con `<img>` y **no** con `next/image`, porque pueden ser
un data URL subido desde el panel y `next/image` exige rutas conocidas en
tiempo de compilación. Las fotos de ejercicios sí usan `next/image`.
