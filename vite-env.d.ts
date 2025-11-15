/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_URL?: string;
  // Agrega más variables de entorno aquí si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
