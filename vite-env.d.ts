/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_BHASHINI_API_KEY?: string;
  readonly VITE_BHASHINI_USER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
