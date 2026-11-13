// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_MASTER_URL: string;
  readonly VITE_SUPABASE_MASTER_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}