# 10. Auditoría UX Mobile-First — AURA GYM

> Informe previo a implementación. Metodología: recorrido completo de las 13 pantallas, los 3 sistemas de navegación, todos los componentes reutilizables y el modelo de datos (LocalStorage). Prioridad absoluta: **experiencia móvil, una sola mano, mínimos clics, cero saturación**.

## Resumen ejecutivo

La app tiene una base visual excelente (skin *liquid glass*, animaciones, branding sólido). El problema **no es estético, es de arquitectura de información y flujos**: hay navegación triplicada en móvil, datos que se piden 3 veces, tres conceptos distintos de "rutina de hoy" que compiten entre sí, y pantallas que apilan demasiada información sin jerarquía clara de "acción principal". Además hay un **bug real de pérdida de datos** en Nutrición.

Veredicto: no hay que maquillar pantallas, hay que **simplificar la estructura y unificar flujos**.

---

## 1. Problemas encontrados

### 🔴 Críticos

**P1 — Bug: recalcular macros en Nutrición borra la identidad del socio.**
En `app/nutricion/page.tsx`, `calculate()` construye un `UserProfile` solo con `age, sex, weight, height, activity, goal, targetWeight` y hace `setProfile(...)`. Como reemplaza el objeto completo, **se pierden `name`, `avatar`, `memberNumber`, `level`, `daysPerWeek`, `plan`, `memberSince`**. Resultado: el carnet, el saludo del dashboard y el avatar del header se rompen tras usar la calculadora.

**P2 — Triple navegación en móvil.** Coexisten en pantalla: (a) Header superior fijo, (b) menú hamburguesa (Sheet), (c) barra inferior (BottomNav) + (d) menú desplegable del avatar. El hamburguesa y el desplegable listan **los mismos** destinos secundarios (Suplementos, Gimnasio, Educación). El usuario tiene 2–3 formas de llegar al mismo sitio.

**P3 — Tres conceptos de "entrenamiento de hoy" que compiten.** Existen tres estados distintos con tres claves de storage:
- `todayRoutine` → lo que armas desde la Biblioteca ("Mi rutina de hoy").
- `dashboardChecks` → el checklist del Dashboard (marcar ejercicios).
- `activeWorkout` → la sesión real con registro de series/peso (WorkoutTracker).

Marcar ejercicios en el Dashboard **no** crea una sesión registrada; para "entrenar de verdad" hay que ir a Rutinas. Dos modelos mentales para la misma acción → confusión.

### 🟠 Importantes

**P4 — El mismo dato se pide en 3 pantallas.** Peso, edad, sexo, altura y objetivo se capturan en Onboarding, **otra vez** en Nutrición y el peso **otra vez** en Progreso. Trabajo repetido y fuentes de verdad en conflicto.

**P5 — Los mismos números se muestran repetidos.** Calorías/macros/peso/objetivo aparecen en Dashboard (6 tarjetas), en resultados de Nutrición y en el Carnet. El usuario ve la misma información 3 veces sin saber cuál es "la buena".

**P6 — Demasiadas puertas para la acción principal (entrenar).** Hay 5 formas de iniciar un entrenamiento: checklist del Dashboard, botón "Entrenar con registro completo", barra flotante de Ejercicios, "Entrenar este día" en Predefinidas y "Empezar" en Mis rutinas. Cada una con matices distintos.

**P7 — Dashboard saturado.** Saludo + botón carnet + 6 tarjetas de macros + banner "calcular macros" + tarjeta de entrenamiento con checklist + 2 botones. No hay una única "acción principal" evidente al abrir la app.

**P8 — La landing es redundante para el usuario que ya entró.** Las 6 tarjetas de features duplican exactamente los destinos de navegación, y un socio con perfil no necesita el hero de marketing cada vez: debería aterrizar en su Dashboard.

### 🟡 Menores / pulido móvil

**P9 — "Fotos de progreso: próximamente".** Ocupa una tarjeta entera con 3 huecos vacíos que no hacen nada. Peso muerto vertical en móvil.

**P10 — Footer de marketing en cada pantalla.** El crédito del creador + teléfono + copyright aparece al final de **todas** las pantallas funcionales, empujando contenido y repitiéndose. En una app, eso va una sola vez (en "Perfil"/"Gimnasio"), no en cada vista.

**P11 — Objetivos táctiles y tipografía al límite.** Labels de la BottomNav a `text-[10px]` (muy pequeñas); alturas de toque de algunos ítems por debajo de los ~44 px recomendados para uso con pulgar.

**P12 — Demasiado aire superior antes del contenido.** `pt-20` del main + `py-10` de página + `PageHeader mb-8` con títulos `text-3xl/4xl` y descripción: en móvil hay que hacer scroll antes de ver lo accionable.

**P13 — Ruido visual acumulado.** Tarjetas de rutina con 3 badges apilados (nivel + frecuencia + objetivo); resultado vacío de Nutrición como bloque `h-64` antes de calcular; atribución de imágenes repetida en lista y en ficha.

---

## 2. Por qué afectan la experiencia

- **Carga cognitiva.** Tres menús y tres "hoy" obligan al usuario a construir un mapa mental complejo de una app que debería ser "abrir → entrenar". Las mejores apps (Spotify, Uber Eats) tienen **una** barra inferior y cero ambigüedad.
- **Desconfianza en los datos.** Ver las mismas calorías en tres sitios (y que a veces se borren, P1) hace que el usuario no sepa cuál es real. La confianza se pierde rápido.
- **Fricción y clics de más.** Pedir peso/altura tres veces y ofrecer cinco caminos para entrenar multiplica decisiones y toques. Mobile-first significa **la ruta más corta a la acción**.
- **Pulgar y lectura.** Labels de 10 px y toques pequeños generan errores; el exceso de aire superior hace que el contenido útil quede "bajo el pliegue".
- **Saturación = abandono.** Una Home con 6 tarjetas + 2 banners + checklist + 2 botones no comunica "qué hago ahora". La claridad de una sola acción principal es lo que hace que una app se sienta moderna.

---

## 3. Cómo propongo solucionarlos

**Principio rector: "una pantalla, una intención".** Cada vista responde a una sola pregunta y expone **una** acción principal.

| # | Solución |
|---|----------|
| P1 | Nutrición debe **fusionar** (merge) sobre el perfil existente, no reemplazarlo. Además, autollenar el formulario con los datos del perfil ya guardado. |
| P2 | Eliminar el menú hamburguesa y el desplegable duplicado en móvil. Navegación primaria = **solo BottomNav**. Lo secundario vive en una pestaña **Perfil/Más**. |
| P3 | Unificar los tres "hoy" en **un único concepto de sesión**. "Agregar a hoy" desde la Biblioteca y el checklist del Dashboard alimentan la misma sesión que registra series. |
| P4 | **Fuente única de verdad**: el perfil. Nutrición y Progreso leen del perfil y solo piden lo que falta. El peso "actual" siempre sale del último registro de Progreso. |
| P5 | El Dashboard muestra el resumen; Nutrición y Carnet **enlazan** a él en vez de re-renderizar los mismos números. Reducir de 6 a 3 tarjetas clave en Home. |
| P6 | Un solo botón primario "Entrenar" por contexto. Predefinidas/Mis rutinas siguen existiendo, pero todas desembocan en el **mismo** flujo de sesión. |
| P7 | Rediseñar Home en bloques jerárquicos: (1) saludo compacto, (2) **tarjeta única "Entrenamiento de hoy" con 1 botón primario**, (3) resumen nutricional compacto (3 datos), (4) accesos rápidos. Sin banners apilados. |
| P8 | Si hay perfil, `/` redirige (o muestra) el Dashboard. La landing de marketing queda para visitantes sin perfil. |
| P9 | Ocultar "Fotos de progreso" hasta que exista la función (o quitarla). |
| P10 | Footer completo solo en Perfil/Gimnasio. En el resto, nada o una línea mínima. |
| P11 | BottomNav: labels `text-[11px]`, alturas de toque ≥ 44 px, íconos 22 px. |
| P12 | Reducir padding superior en móvil y compactar PageHeader (sin eyebrow gigante en pantallas de app). |
| P13 | Un solo badge relevante por tarjeta; resultado de Nutrición inline tras calcular; atribución una sola vez. |

---

## 4. Qué componentes ELIMINARÍA

- **Menú hamburguesa (Sheet) del Header en móvil** → redundante con BottomNav + Perfil (P2).
- **Desplegable de destinos secundarios del avatar** en su forma actual → se reemplaza por la pestaña Perfil (P2).
- **Tarjeta "Fotos de progreso (próximamente)"** → sin valor hoy (P9).
- **Footer de marketing repetido** en pantallas funcionales → queda solo en Perfil/Gimnasio (P10).
- **Banners apilados del Dashboard** ("crear perfil" + "calcular macros" a la vez) → como máximo un aviso contextual (P7).
- **6 tarjetas de feature de la landing para usuarios con perfil** → la landing solo se ve sin sesión (P8).
- **Código muerto asociado** que quede sin uso tras la unificación (p. ej. `dashboardChecks` si se fusiona con la sesión — P3).

## 5. Qué componentes FUSIONARÍA

- **Los tres "hoy" → una sola `TodaySession`** (P3): un único hook/estado que representa el entrenamiento del día y su registro. Biblioteca, Dashboard y Rutinas operan sobre él.
- **Formularios físicos de Onboarding + Nutrición → un solo `BodyDataForm` reutilizable** (P4): mismos campos, autollenado desde el perfil, usado en ambos sitios.
- **Header (móvil) + BottomNav → una navegación única**: el header móvil se reduce a marca + tema; la navegación real es la BottomNav; lo secundario entra en **Perfil**.
- **Carnet + "Editar datos" + accesos de socio → pestaña Perfil** (P2/P5): un solo lugar para identidad, carnet, ajustes y enlaces secundarios.
- **Tarjetas de resumen (MacroCard del Dashboard y bloques de resultado de Nutrición)** → un componente de "stat" compartido para no duplicar estilos ni datos (P5).

## 6. Qué componentes CREARÍA

- **`MobileTopBar`** minimalista para pantallas de app (marca + tema, sin hamburguesa).
- **`TodayWorkoutCard`**: la tarjeta única y protagonista del Dashboard, con **1** acción primaria ("Entrenar" / "Continuar").
- **`BodyDataForm`** reutilizable (P4/P5) con autollenado desde perfil.
- **`useTodaySession`** (hook) que unifica el estado del entrenamiento del día (P3).
- **`StatTile`** compartido para métricas (reemplaza duplicación entre MacroCard y resultados de Nutrición).
- **Pantalla/pestaña `Perfil`** que absorbe carnet, ajustes, borrar datos y accesos secundarios (Gimnasio, Suplementos, Educación).
- **`SectionHeader`** compacto (versión ligera de PageHeader para móvil).

## 7. Flujo de navegación propuesto

**Navegación primaria = una sola BottomNav de 5 destinos (móvil):**

```
[ Hoy ]   [ Ejercicios ]   [ Rutinas ]   [ Nutrición ]   [ Perfil ]
 Home       Biblioteca       Entrenar      Plan+dietas     Socio/Ajustes
```

- **Hoy (Dashboard):** saludo compacto → **TodayWorkoutCard** (acción principal única) → resumen nutricional de 3 datos → accesos rápidos. Punto de entrada de un socio con perfil.
- **Ejercicios:** biblioteca + buscador + filtros. "Agregar a hoy" alimenta la sesión única. Barra flotante "Entrenar ahora".
- **Rutinas:** Predefinidas / Mis rutinas / Historial (tabs). Todo desemboca en el mismo WorkoutTracker.
- **Nutrición:** calculadora (autollenada desde perfil, hace *merge*) + dietas. Sin volver a pedir lo que ya sabemos.
- **Perfil:** carnet, editar datos, **Progreso** accesible aquí y/o desde Hoy, ajustes, borrar datos, y enlaces a **Gimnasio / Suplementos / Educación** (secundarios).

**Reglas de flujo:**
- Sin perfil → Landing con **un** CTA ("Crear mi cuenta"). Con perfil → **Hoy**.
- Progreso se alcanza desde Hoy (tarjeta de peso) y desde Perfil, sin duplicar entradas.
- El header móvil deja de ser navegación: solo marca + tema. Cero hamburguesa.

**Nota sobre "Progreso" en la barra:** hoy la BottomNav tiene Progreso y no Perfil. Dos opciones a decidir contigo:
- **A)** `Hoy · Ejercicios · Rutinas · Nutrición · Perfil` (Progreso dentro de Hoy/Perfil). Más limpio, estilo app comercial.
- **B)** `Hoy · Ejercicios · Rutinas · Nutrición · Progreso` (Perfil en el header/avatar). Cambia menos la estructura actual.

---

## Plan de implementación por fases (cada fase = 1 commit)

1. **Fix crítico:** Nutrición hace *merge* del perfil (P1). *(bajo riesgo, alto valor)*
2. **Navegación única en móvil:** quitar hamburguesa redundante, definir BottomNav final + pestaña/acceso Perfil (P2).
3. **Unificar "hoy":** `useTodaySession` y conectar Dashboard/Biblioteca/Rutinas (P3, P6).
4. **Rediseño de Home:** TodayWorkoutCard + resumen de 3 datos, quitar banners/tarjetas de más (P5, P7).
5. **`BodyDataForm` reutilizable + autollenado** en Onboarding y Nutrición (P4).
6. **Limpieza:** fotos "próximamente", footer repetido, landing para logueados, padding móvil, tamaños táctiles, badges (P8–P13).
7. **Barrido de código muerto** tras las fusiones.

> Cada cambio conserva las funcionalidades existentes; solo se reorganiza el acceso a ellas. Nada se elimina sin que su función quede cubierta por otra vía.
