import axios from 'axios';
import { AppConfig, TokenInfo, UserInfo, GroupData, IDP, TechUser, OAuthClient, TrustServiceData, SubscriptionTier } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Set auth token for all requests
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export async function getAppConfig(): Promise<AppConfig> {
  const res = await api.get('/config', { baseURL: '/' });
  return res.data;
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

