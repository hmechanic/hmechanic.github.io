# HMechanic Portfolio

Portafolio personal construido con React, TypeScript, Vite, Tailwind CSS y componentes 3D con Three.js.

## Requisitos

- Node.js 22.13 o superior.
- pnpm 11.9.0. Si usas Corepack:

```bash
corepack enable
corepack prepare pnpm@11.9.0 --activate
```

## Instalación

Instala las dependencias desde el lockfile de pnpm:

```bash
pnpm install
```

## Desarrollo local

Levanta el servidor de desarrollo con hot reload:

```bash
pnpm run dev
```

Vite mostrará la URL local en la terminal, normalmente `http://localhost:5173/`.

## Validación

Ejecuta el linter:

```bash
pnpm run lint
```

Genera el build de producción:

```bash
pnpm run build
```

El resultado se crea en `dist/`.

## Preview de producción

Después de compilar, revisa localmente el build final:

```bash
pnpm run preview
```

## Estructura básica

- `src/main.tsx`: punto de entrada de React.
- `src/App.tsx`: composición principal del sitio.
- `src/components/`: secciones y componentes reutilizables.
- `src/components/3d/`: componentes visuales con Three.js.
- `src/assets/`: contenido y recursos del portafolio.
- `public/`: archivos estáticos servidos sin procesar.

## Deploy en GitHub Pages

El repositorio incluye un workflow en `.github/workflows/deploy.yml`. Para activarlo en GitHub:

1. Abre el repositorio en GitHub.
2. Ve a `Settings > Pages`.
3. En `Source`, selecciona `GitHub Actions`.
4. Haz push a `main` para ejecutar el despliegue.
