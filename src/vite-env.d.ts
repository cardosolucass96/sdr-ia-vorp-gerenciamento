/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly EVOLUTION_API_URL: string;
  readonly EVOLUTION_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
