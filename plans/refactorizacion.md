# Plan de refactorización y organización del repositorio

> Documento de planificación. Describe el trabajo por fases para llevar
> `hmechanic.github.io` a una estructura predecible, profesional y mantenible
> **sin cambiar el comportamiento visible del sitio**.

## Contexto

Portafolio Vite + React 19 + TypeScript (~2.400 líneas de fuente) que ha crecido
por acumulación: primero el sitio, luego i18n, luego la ruta `/cv`, y más
recientemente el sistema de animaciones de entrada (`Reveal`) y la paginación
lateral (`SectionProgress`). Cada capa se añadió sin reorganizar la anterior, y
hoy conviven varios síntomas típicos de deuda estructural:

- **Estructura plana sin jerarquía de intención.** `src/components/` mezcla
  páginas (`CvViewer`), layout (`Navbar`, `Layout`, `SectionProgress`),
  secciones (`Hero`, `About`, …) y primitivas de animación (`Reveal`). No hay
  `pages/`, `hooks/` ni alias de import — todo son rutas relativas
  (`../i18n/LanguageContext`).
- **Hooks colocados dentro de componentes.** `useI18n` vive en
  `LanguageContext.tsx` (obliga a un `eslint-disable react-refresh/only-export-components`)
  y `useReveal` vive en `Reveal.tsx`. Mismo antipatrón repetido.
- **Archivos que hacen demasiado.** `CombustionReaction.tsx` (495 líneas, 6
  responsabilidades) y `translations.tsx` (~250 líneas con ambos idiomas
  entrelazados).
- **Datos de contenido incrustados en componentes.** La lista de proyectos, el
  teléfono de WhatsApp, el nombre del footer y URLs de redes están como
  literales dentro del JSX, duplicando información que ya vive en los YAML del CV.
- **Tooling incompleto.** Sin Prettier (el repo mezcla indentación de 2 y 4
  espacios), sin tests, y CI nunca ejecuta `lint` — solo `build`.
- **Documentación desalineada.** `AGENTS.md` describe una estructura que ya no
  existe; falta `LICENSE`.

**Resultado buscado:** un repositorio con estructura predecible, una única fuente
de verdad por cada dato, archivos de tamaño legible, formato homogéneo aplicado
automáticamente, una red de seguridad mínima de tests, y CI que bloquea
regresiones.

**Restricción clave:** el sitio en producción debe verse y comportarse
_exactamente igual_ al terminar. Esto es refactorización, no rediseño.

**Método de trabajo:** rama `refactor/repo-structure` (no directamente sobre
`main`); un commit por fase, con el reformateo de Prettier aislado en su propio
commit; movimientos de archivos con `git mv` para preservar el historial.

---

## Fase 0 — Base de tooling

_Commits aislados, sin cambios de lógica. Se hace primero para que todo lo
posterior nazca ya formateado y verificado._

### 0.1 Prettier (2 espacios)

Coincide con lo que ya declara `AGENTS.md` y con la convención del ecosistema.

- `.prettierrc` → `{ "semi": true, "singleQuote": true, "tabWidth": 2, "printWidth": 100 }`
- `.prettierignore` → `dist`, `pnpm-lock.yaml`, `public/cv`
- Añadir `eslint-config-prettier` al final de `eslint.config.js` para que ESLint
  y Prettier no compitan por las reglas de formato.
- **El reformateo del repo completo va en su propio commit**, separado de
  cualquier cambio semántico. Sin esto, el diff de las fases siguientes es
  ilegible.

### 0.2 Scripts en `package.json`

```jsonc
"format":      "prettier --write .",
"format:check":"prettier --check .",
"typecheck":   "tsc -b --noEmit",
"test":        "vitest run",
"test:watch":  "vitest"
```

### 0.3 Higiene de configuración

- `.editorconfig` y `.nvmrc` (Node 22, alineado con `deploy.yml`).
- `.gitignore`: añadir `.env`, `.env.*`, `!.env.example` — hoy no hay ninguna
  entrada de env pese a que `AGENTS.md` advierte sobre ello.
- Mover `@types/three` de `dependencies` a `devDependencies` (es un paquete de
  tipos; no pertenece al bundle de runtime).

### 0.4 Alias `@/`

Elimina las cadenas `../../` que la nueva estructura haría más profundas.

- `vite.config.ts`: `resolve.alias` con `@` → `./src`.
- `tsconfig.app.json`: `baseUrl` + `paths`.
- Se aplicará en todos los imports de `src/` durante la Fase 1.

---

## Fase 1 — Reorganización estructural

Estructura destino:

```
src/
├── main.tsx                    entry: providers + App
├── app/
│   ├── App.tsx                 solo <RouterProvider>
│   ├── router.tsx              definición de rutas (incl. catch-all)
│   └── providers.tsx           composición de providers
├── pages/
│   ├── HomePage.tsx            composición de secciones
│   ├── CvPage.tsx              (era components/CvViewer.tsx)
│   └── NotFoundPage.tsx        nueva — ver Fase 4
├── components/
│   ├── layout/                 Layout, Navbar, Footer, LanguageToggle,
│   │                           SocialLinks, SectionProgress
│   ├── sections/               Hero, About, Experience, Skills, Projects, Contact
│   ├── motion/                 Reveal (+ useReveal sale a hooks/)
│   └── three/                  HeroBackground + combustion/
├── hooks/                      useI18n, useReveal, useHashScroll,
│                               usePdfAvailability
├── i18n/
│   ├── index.ts                re-exports públicos
│   ├── LanguageContext.tsx     solo el provider
│   ├── types.ts                interfaz Translation + type Language
│   └── locales/{es,en}.tsx     un archivo por idioma
├── content/                    projects.ts, site.ts  (datos editables)
├── lib/cv.ts                   (era utils/loadCv.ts)
├── types/cv.ts                 (era types.ts)
└── styles/{index.css, palette.ts}
```

### Movimientos y extracciones concretas

1. **`src/App.tsx` se disuelve:** `HashScroll` → `hooks/useHashScroll.ts`;
   `HomePage` → `pages/HomePage.tsx`; el array `router` → `app/router.tsx`;
   queda `app/App.tsx` con solo el `RouterProvider`.

2. **`useI18n` sale de `LanguageContext.tsx`** → `hooks/useI18n.ts`. Esto
   **elimina el `eslint-disable react-refresh/only-export-components`** que
   existe únicamente por esa colocación. El disable desaparece porque su causa
   desaparece, no porque lo silenciemos.

3. **`useReveal` sale de `Reveal.tsx`** → `hooks/useReveal.ts`. `Reveal.tsx`
   (el wrapper `<Reveal>`) se queda en `components/motion/` e importa el hook.
   Mismo criterio que con `useI18n`: hooks en `hooks/`, componentes en
   `components/`.

4. **`translations.tsx` se divide:** `i18n/types.ts` (interfaz `Translation`,
   `Language`, `LANGUAGES`) + `i18n/locales/es.tsx` + `i18n/locales/en.tsx`.
   Añadir un tercer idioma pasa de editar un archivo de ~300 líneas a crear uno
   nuevo. Se conserva `ReactNode` en las cadenas por ahora (sacar el
   `<span className="text-neon-cyan">` de las traducciones es una mejora aparte,
   no bloqueante).

5. **`Navbar.tsx` (~180 líneas) — deduplicar:** los bloques de redes+email están
   duplicados casi literalmente (menú desktop y móvil), igual que el enlace
   `/cv` con `cvLinkAnimation`. Extraer `SocialLinks` y `CvNavLink` a
   `components/layout/`, parametrizando solo el `size` del icono y las clases que
   difieren. `LanguageToggle` (ya un subcomponente interno) sale a su propio
   archivo.

6. **`Layout.tsx`:** el `<footer>` sale a `components/layout/Footer.tsx`.

### Convención de nombres

- Componentes en PascalCase `.tsx`; hooks/utils en camelCase `.ts`.
- Renombrar `src/assets/cv_es.yaml` → `src/content/cv/cv-es.yaml` (y `en`) para
  que coincida con el kebab-case de `public/cv/cv-es.pdf`; hoy la misma pareja
  conceptual usa dos convenciones. Actualizar los imports `?raw` en `lib/cv.ts`.
- **Sin barrel files indiscriminados:** solo `i18n/index.ts`. Los barrels por
  carpeta de componentes rompen el tree-shaking y crean ciclos sin aportar aquí.

---

## Fase 2 — Contenido y fuente única de verdad

_Objetivo: que ningún dato del sitio viva en dos sitios a la vez._

### 2.1 `src/content/projects.ts`

Sacar el array de proyectos de `Projects.tsx`. Hoy tiene además un fallo real:
las descripciones se buscan con `t.projects.descriptions[project.title]`, tipado
como `Record<string, string>`, así que **cambiar un título rompe la descripción
en silencio, sin error de tipos**.

Solución: dar a cada proyecto un `id: 'satemis-platform' | 'satemis-frontend' | …`,
tipar las descripciones como `Record<ProjectId, string>` y buscar por `id`. Un id
faltante pasa a ser error de compilación.

### 2.2 `src/content/site.ts`

El teléfono de WhatsApp (`Contact.tsx`) y cualquier constante de sitio.

### 2.3 Leer del CV en vez de duplicar

- `Layout.tsx` tiene `"Hernan Dario Mojica Diaz"` hardcodeado → usar
  `cv.heading.name`.
- `Contact.tsx` duplica las URLs de GitHub/LinkedIn que `Navbar.tsx` ya lee
  correctamente desde `cv.subheading`. Reutilizar el mismo `SocialLinks`
  extraído en la Fase 1.

### 2.4 Paleta de color unificada

Hoy los hex neón están en 4+ sitios (`tailwind.config.js`, `index.css`, el
`THEME` de `CombustionReaction.tsx`, y literales sueltos en `Navbar.tsx`,
`Reveal`, `SectionProgress`).

- Crear `src/styles/palette.ts` como fuente única.
- Convertir `tailwind.config.js` → `tailwind.config.ts` (Tailwind 3.3+ lo
  soporta) e importar la paleta.
- Los componentes que hoy usan literales importan de ahí.

### 2.5 Código muerto a eliminar

Verificado por grep, sin referencias:

- `lib/cv.ts` — el export `cvData` ("backwards-compatible default") no lo usa
  nadie.
- `i18n` — la clave `hero.role`, definida en la interfaz y en ambos locales, no
  la consume ningún componente.

> **Nota:** los tipos `Job`, `SubheadingItem`, `SectionContentGroup` **sí se
> usan** de forma transitiva vía `ExperienceGroup` / `SubheadingSection`. No se
> tocan.

### 2.6 Fuera de alcance (señalado)

Los `as` sin validación (`lib/cv.ts`, `Experience.tsx`, `Skills.tsx`) se dejan
como están. Sustituirlos por validación en runtime (zod o type guard) es una
mejora legítima pero añade dependencia y superficie; queda como trabajo
posterior en lugar de colarse aquí.

---

## Fase 3 — Dividir el componente 3D

`src/components/3d/CombustionReaction.tsx` (495 líneas) →
`src/components/three/combustion/`:

| Archivo                  | Contenido actual                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `resources.ts`           | geometrías y materiales compartidos, `getAtomMaterial`, `getLabelMaterial`         |
| `molecules.ts`           | tipos `MoleculeType`/`Recipe`, `MOLECULES`, `bondTransform`                        |
| `Molecule.tsx`           | el componente de render                                                            |
| `simulation.ts`          | tipos de partículas, constantes de límites, `makeInitialParticles`, helpers `rand` |
| `CombustionScene.tsx`    | el bucle de simulación                                                             |
| `CombustionReaction.tsx` | wrapper público: luces, cámara, `<Canvas>`                                         |

El `THEME` pasa a derivarse de `styles/palette.ts`.

**Punto delicado:** el archivo tiene `/* eslint-disable react-hooks/immutability */`
a nivel de archivo. Es _intencional_ — la simulación muta refs por frame a
propósito, que es la forma correcta en react-three-fiber. Al dividir, ese disable
debe quedar **solo en `CombustionScene.tsx` y `simulation.ts`**, no propagarse a
los archivos que no lo necesitan. Reducir su alcance es parte del valor de la
división.

---

## Fase 4 — Ruta 404 y redirección SPA

`public/404.html` mantiene un allowlist manual: `var appRoutes = ['/cv', '/cv/']`.
Cada ruta nueva exige editar ese archivo a mano, y olvidarlo produce un 404 duro
en producción — una trampa de mantenimiento silenciosa.

- Cambiar `404.html` para que guarde **cualquier** path en `sessionStorage` y
  redirija a `/`; el router de React resuelve qué es válido.
- Añadir una ruta catch-all `*` → `pages/NotFoundPage.tsx` para que las rutas
  realmente inexistentes muestren un 404 propio del sitio en lugar de caer al
  home en silencio.

---

## Fase 5 — Tests (Vitest + Testing Library)

Red de seguridad mínima, no cobertura exhaustiva. Se priorizan las piezas con
lógica real.

- `pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom`
  - `vitest.config.ts` (reutilizando el alias `@/`).
- `lib/cv.test.ts` — ambos YAML parsean y exponen las claves que los componentes
  esperan. Protege contra un YAML mal editado, hoy el fallo más probable del repo.
- `i18n/locales.test.ts` — **es y en tienen exactamente el mismo conjunto de
  claves**. El test de mayor valor: hoy nada impide olvidar una traducción.
- `hooks/useI18n.test.tsx` — resolución de idioma inicial (localStorage →
  navigator → 'es'), toggle, y que lanza error fuera del provider.
- `content/projects.test.ts` — todo `ProjectId` tiene descripción en ambos
  idiomas.

Tests de los componentes 3D quedan fuera: montar WebGL en jsdom da más falsos
negativos que valor.

---

## Fase 6 — CI y documentación

### 6.1 CI

`.github/workflows/deploy.yml` — hoy `pnpm run lint` no se ejecuta nunca en CI;
el lint es puramente advisorio. Añadir un job `quality` (lint + `format:check` +
`typecheck` + `test`) del que dependa `build`. Así un fallo de calidad bloquea el
deploy en lugar de publicarse.

### 6.2 Documentación

- `AGENTS.md` — actualizar: hoy afirma que `src/assets/` contiene SVGs (no existe
  ninguno), que la convención es 2 espacios (la mayoría de archivos usa 4), y no
  menciona `src/i18n/` ni la ruta `/cv`. Reescribir contra la estructura nueva.
- `README.md` — está decente (español); actualizar la sección "Estructura
  básica" (omite `src/i18n/`) y añadir i18n, tests y licencia.
- `LICENSE` — añadir **MIT**, a nombre de Hernan Dario Mojica Diaz.
- `CONTRIBUTING.md` — breve, remitiendo a `AGENTS.md`.

### 6.3 Optimización del favicon

`public/conejo-de-paramo.png` (824 KB) se usa solo como favicon. Generar
variantes reducidas (32px, 180px para Apple touch, 512px) y enlazarlas en
`index.html`. **El original se conserva intacto**; las variantes son archivos
nuevos. Se usará ImageMagick vía CLI si está disponible (sin añadir dependencias
al proyecto) o `sharp` como devDependency puntual.

---

## Hallazgos que se reportan, no se arreglan

Cosas reales encontradas que **no** se inventan ni se resuelven por cuenta propia:

1. **`public/cv/cv-en.pdf` no existe** — solo está `cv-es.pdf`. Con el idioma en
   inglés, `/cv` muestra el mensaje `missingPdf`. El código funciona
   correctamente; falta el archivo. Debe proporcionarlo el autor.
2. **SEO e i18n no están conectados:** `index.html` fija `lang="es"` y metadatos
   solo en español, y el idioma no se refleja en la URL. Un enlace compartido
   siempre resuelve al idioma guardado del visitante, y los buscadores solo ven
   la versión española. Arreglarlo bien (rutas `/en/`, `hreflang`) es un cambio
   de arquitectura de rutas, fuera del alcance de una refactorización que no debe
   cambiar comportamiento.
3. **`dist/` está en el árbol de trabajo local** aunque está en `.gitignore`, y
   está obsoleto (contiene `dist/vite.svg` sin fuente correspondiente). Se puede
   borrar localmente sin riesgo.

---

## Verificación

Tras cada fase, y obligatoriamente al final:

```bash
pnpm run format:check   # formato homogéneo
pnpm run lint           # sin errores nuevos
pnpm run typecheck      # tsc estricto limpio
pnpm run test           # suite en verde
pnpm run build          # build de producción
pnpm run preview        # verificación manual
```

**Comprobación manual en `preview`** — el criterio de aceptación es que nada
cambió visiblemente:

- Home: las 6 secciones renderizan; la animación de combustión corre sin errores
  de consola; los `Reveal` de entrada disparan al hacer scroll.
- `SectionProgress`: el riel lateral se rellena con el scroll y el punto activo
  sigue a la sección visible (desktop); oculto en `/cv`.
- Navegación por hash (`/#about`, `/#projects`) hace scroll correctamente, desde
  la home y desde `/cv`.
- Toggle ES/EN: cambian textos **y** datos del CV; persiste al recargar;
  `<html lang>` se actualiza.
- `/cv`: carga el PDF en español; en inglés muestra el aviso de faltante
  (comportamiento esperado hasta que exista `cv-en.pdf`).
- Recarga directa en `/cv` (prueba del redirect SPA) y una ruta inventada
  (`/xyz`) → nuevo `NotFoundPage`.
- Menú móvil: abre/cierra, los enlaces cierran el menú, redes y toggle presentes.
- `prefers-reduced-motion`: con la preferencia activada, `Reveal` y
  `SectionProgress` colapsan a apariciones instantáneas / scroll no animado.

```

```
