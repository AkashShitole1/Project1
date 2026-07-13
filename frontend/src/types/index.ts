export interface DecodedToken {
  sub?: string;
  user_name?: string;
  email?: string;
  client_id?: string;
  azp?: string;
  aud?: string | string[];
  iss?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  scope?: string;
  'sws.samauth.ten'?: string;
  'sws.samauth.role'?: string[];
  'sws.samauth.tiers'?: string[];
  [key: string]: unknown;
}

export interface TokenInfo {
  raw: string;
  header: Record<string, unknown>;
  payload: DecodedToken;
  mock?: boolean;
}

export interface UserInfo {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  userId?: string;
  tenant?: string;
  origin?: string;
  previousLoginTime?: string;
  currentLoginTime?: string;
  mock?: boolean;
}

export interface Group {
  id: string;
  displayName: string;
  type?: string;
  description?: string;
}

export interface GroupData {
  applicationGroups: Group[];
  tenantGroups: Group[];
  userGroups: Group[];
  mock?: boolean;
}

export interface IDP {
  id: string;
  type: string;
  name: string;
  issuer: string;
  origin: string;
  active: boolean;
}

export interface TechUser {
  clientId: string;
  clientSecret: string;
  description?: string;
  expiry: string;
  createdAt: string;
}

export interface OAuthClient {
  clientId: string;
  name?: string;
  audience: string | string[];
  grantTypes: string[];
  redirectUris: string[];
  scopes: string[];
  tokenEndpointAuthMethod?: string;
}

export interface TrustServiceData {
  whitelistedGroups: string[];
  requestedGroups: string[];
  subscribedGroups: string[];
  grantedRoles: Array<{ role: string; source: string }>;
  mock?: boolean;
}

export interface SubscriptionTier {
  tier: string;
  active: boolean;
  features: string[];
  maxTechUsers: number;
}

export interface AppConfig {
  mockMode: boolean;
  oidcIssuer: string;
  oidcClientId: string;
  oidcRedirectUri: string;
  oidcScopes: string;
  iamBaseUrl: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  idToken: string | null;
  user: UserInfo | null;
  error: string | null;
}

