/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TIKTOK_ADVERTISER_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
