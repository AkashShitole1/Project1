import axios from 'axios';
import { AppConfig, TokenInfo, UserInfo, GroupData, IDP, TechUser, OAuthClient, TrustServiceData, SubscriptionTier } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

const DEFAULT_APP_CONFIG: AppConfig = {
  // Safe fallback for static deployments without backend config endpoint.
  mockMode: true,
  oidcIssuer: '',
  oidcClientId: '',
  oidcRedirectUri: '',
  oidcScopes: 'openid profile email',
  iamBaseUrl: '',
};

function resolveConfigUrlFromLocation(): URL {
  const { origin, pathname, href } = window.location;
  const segments = pathname.split('/').filter(Boolean);

  // For gateway deployments like /app12345-logt1dev/, always anchor to app root.
  if (segments.length > 0) {
    return new URL('config.json', `${origin}/${segments[0]}/`);
  }

  return new URL('config.json', href);
}

function normalizeAppConfig(raw: Partial<AppConfig> | Record<string, unknown> | undefined): AppConfig {
  const data = (raw || {}) as Record<string, unknown>;
  const envMockMode = import.meta.env.VITE_MOCK_MODE === 'true';
  const mockMode = typeof data.mockMode === 'boolean' ? (data.mockMode as boolean) : envMockMode || DEFAULT_APP_CONFIG.mockMode;

  return {
    mockMode,
    oidcIssuer: (data.oidcIssuer as string) || (import.meta.env.VITE_OIDC_ISSUER as string) || DEFAULT_APP_CONFIG.oidcIssuer,
    oidcClientId: (data.oidcClientId as string) || (import.meta.env.VITE_OIDC_CLIENT_ID as string) || DEFAULT_APP_CONFIG.oidcClientId,
    oidcRedirectUri: (data.oidcRedirectUri as string) || (import.meta.env.VITE_OIDC_REDIRECT_URI as string) || DEFAULT_APP_CONFIG.oidcRedirectUri,
    oidcScopes: (data.oidcScopes as string) || (import.meta.env.VITE_OIDC_SCOPES as string) || DEFAULT_APP_CONFIG.oidcScopes,
    iamBaseUrl: (data.iamBaseUrl as string) || (import.meta.env.VITE_IAM_BASE_URL as string) || DEFAULT_APP_CONFIG.iamBaseUrl,
  };
}

// Set auth token for all requests
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export async function getAppConfig(): Promise<AppConfig> {
  console.info('[CONFIG] Loading config');

  try {
    const configUrl = resolveConfigUrlFromLocation();
    const res = await axios.get(configUrl.toString(), { timeout: 5000 });
    console.info('[CONFIG] Config loaded');
    return normalizeAppConfig(res.data);
  } catch (error) {
    console.warn('[CONFIG] Config failed', error);
  }

  console.info('[MOCK] Using mock configuration');
  return normalizeAppConfig({ mockMode: true });
}

export async function getTokenInfo(rawToken?: string): Promise<TokenInfo> {
  const res = await api.post('/token/decode', rawToken ? { token: rawToken } : {});
  return res.data;
}

export async function getUserInfo(): Promise<UserInfo> {
  const res = await api.get('/userinfo');
  return res.data;
}

export async function getUserMe(): Promise<UserInfo> {
  const res = await api.get('/user/me');
  return res.data;
}

export async function getRoles(): Promise<{ roles: string[]; mock?: boolean }> {
  const res = await api.get('/roles');
  return res.data;
}

export async function getScopes(): Promise<{ scopes: string[]; mock?: boolean }> {
  const res = await api.get('/scopes');
  return res.data;
}

export async function getGroups(): Promise<GroupData> {
  const res = await api.get('/groups');
  return res.data;
}

export async function getIDPs(): Promise<{ idps: IDP[]; mock?: boolean }> {
  const res = await api.get('/idp');
  return res.data;
}

export async function getOAuthClient(): Promise<{ client: OAuthClient; mock?: boolean }> {
  const res = await api.get('/oauth-client');
  return res.data;
}

export async function getTechUsers(): Promise<{ techUsers: TechUser[]; mock?: boolean }> {
  const res = await api.get('/tech-users');
  return res.data;
}

export async function createTechUser(description: string): Promise<{ techUser: TechUser; mock?: boolean }> {
  const res = await api.post('/tech-users', { description });
  return res.data;
}

export async function deleteTechUser(clientId: string): Promise<void> {
  await api.delete(`/tech-users/${clientId}`);
}

export async function exchangeToken(sourceToken: string, providerTenant: string): Promise<{
  originalClaims: Record<string, unknown>;
  exchangedClaims: Record<string, unknown>;
  exchangedToken: string;
  mock?: boolean;
}> {
  const res = await api.post('/token/exchange', { sourceToken, providerTenant });
  return res.data;
}

export async function getTrustService(): Promise<TrustServiceData> {
  const res = await api.get('/trust-service');
  return res.data;
}

export async function getSubscriptions(): Promise<{ tiers: SubscriptionTier[]; activeTiers: string[]; mock?: boolean }> {
  const res = await api.get('/subscriptions');
  return res.data;
}

export async function checkHealth(): Promise<{ status: string; mode: string }> {
  const res = await api.get('/health', { baseURL: '/' });
  return res.data;
}

export default api;
