/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCK_MODE?: string;
  readonly VITE_OIDC_ISSUER?: string;
  readonly VITE_OIDC_CLIENT_ID?: string;
  readonly VITE_OIDC_REDIRECT_URI?: string;
  readonly VITE_OIDC_SCOPES?: string;
  readonly VITE_IAM_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

