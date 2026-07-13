import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mockMode: process.env.MOCK_MODE === 'true',

  // OIDC
  oidcIssuer: process.env.OIDC_ISSUER || '',
  oidcClientId: process.env.OIDC_CLIENT_ID || '',
  oidcClientSecret: process.env.OIDC_CLIENT_SECRET || '',
  oidcRedirectUri: process.env.OIDC_REDIRECT_URI || 'http://localhost:3000/callback',
  oidcScopes: process.env.OIDC_SCOPES || 'openid profile email',

  // IAM
  iamBaseUrl: process.env.IAM_BASE_URL || '',

  // Session
  sessionSecret: process.env.SESSION_SECRET || 'fds-iam-playground-secret-change-in-production',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default config;

