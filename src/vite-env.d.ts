/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_OIDC_CLIENT_ID: string
  readonly VITE_STORAGE_PUBLIC_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
