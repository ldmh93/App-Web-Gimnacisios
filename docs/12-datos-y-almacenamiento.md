# Datos y almacenamiento

## Regla única

**Nada toca `localStorage` directamente.** Todo pasa por `lib/storage.ts`, que
centraliza las claves y traga los errores de cuota para que la aplicación no se
caiga si el navegador se queda sin sitio.

El día que exista API, se sustituyen `loadFromStorage` / `saveToStorage` por
llamadas de red y ninguna pantalla se entera. Ese es el motivo de la capa.

## Claves

### Datos del socio

Se borran con «Borrar mis datos». Están listadas en `USER_DATA_KEYS`.

| Clave | Contenido |
|---|---|
| `fitcore:profile` | `UserProfile`: edad, sexo, peso, objetivo, nivel… |
| `fitcore:nutrition` | `NutritionResult` vigente |
| `fitcore:nutrition-plan` | `NutritionPlan`: actual, anterior y fecha de cálculo |
| `fitcore:custom-routines` | `CustomRoutine[]` creadas por el socio |
| `fitcore:workout-sessions` | `WorkoutSession[]`: el historial completo |
| `fitcore:active-workout` | Sesión en curso, o `null` |
| `fitcore:progress` | `ProgressEntry[]`: peso, medidas y fotos |
| `fitcore:today-routine` | Plan del día, caduca a medianoche |
| `fitcore:favorites` | Ids de ejercicios marcados |
| `fitcore:read-notifications` | Ids de avisos ya leídos |
| `fitcore:demo-seeded` | Marca de siembra de la demostración |
| `fitcore:notify-enabled` | Interruptor de avisos |

### Configuración del gimnasio

**No** se borran con «Borrar mis datos»: son del administrador, no del socio.
Borrarlas dejaría al gimnasio sin cuentas ni identidad.

| Clave | Contenido |
|---|---|
| `fitcore:brand` | `BrandConfig` activa |
| `fitcore:brand-presets` | Biblioteca de marcas guardadas |
| `fitcore:accounts` | `Account[]` con rol y membresía |
| `fitcore:auth-session` | Sesión iniciada |
| `fitcore:gym-photos` | Galería administrable |
| `fitcore:gym-info` | Datos de contacto, historia y filosofía |
| `fitcore:nutritionist` | Ficha del profesional de nutrición |
| `fitcore:notifications` | Avisos publicados y borradores |

### Preferencias del dispositivo

`fitcore:rest-seconds` (descanso por defecto) y
`fitcore:presentacion-vista` (presentación ya vista). No son datos del socio ni
del gimnasio: acompañan al dispositivo.

## Catálogos estáticos

Viven en el código, no en almacenamiento, porque son parte del producto:

| Archivo | Contenido |
|---|---|
| `data/exercisesDb.ts` | 630 ejercicios importados, con imagen y GIF. **Generado**, no editar a mano |
| `data/exercises.ts` | 54 ejercicios curados y la biblioteca visible |
| `data/muscleMap.ts` | 14 regiones del cuerpo y cómo se resuelven |
| `data/bodyShapes.ts` | Geometría del cuerpo interactivo |
| `data/routines.ts` | Rutinas predefinidas |
| `data/diets.ts`, `data/supplements.ts`, `data/articles.ts` | Contenido educativo |
| `data/gym.ts` | Datos por defecto del gimnasio |
| `data/demoMembers.ts` | Los diez socios de ejemplo |

### Sobre la biblioteca visible

`LIBRARY_EXERCISES` son **solo** los 630 importados, no los 54 curados. Fue una
decisión deliberada (los curados duplicaban ejercicios del dataset), pero tiene
una consecuencia: las fichas con «errores comunes» y «consejos» no aparecen en
la biblioteca, aunque sí se usan en rutinas e historial vía `getExercise`.

## Límite del almacenamiento

El navegador da unos **5 MB por dominio, para todo**. Por eso:

- Las imágenes que sube el administrador se comprimen a WebP antes de guardarse.
- Se avisa con los KB concretos si una imagen no cabe, en vez de fallar en
  silencio.
- Las fotos de progreso se reescalan a 900 px.

Si se llena, `saveToStorage` traga el error y la aplicación sigue funcionando en
memoria hasta recargar. No se pierde la sesión.
