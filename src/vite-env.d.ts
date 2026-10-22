/// <reference types="vite/client" />

// Parsed at build time by the yaml plugin in vite.config.ts.
declare module '*.yaml' {
  const data: unknown;
  export default data;
}
