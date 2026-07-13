// Mock data service — returned when MOCK_MODE=true or IAM is unreachable

export const mockAccessToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2sta2V5LTEifQ.' +
  'eyJzdWIiOiJ1c2VyLTEyMzQ1Njc4OTAiLCJ1c2VyX25hbWUiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJjbGllbnRfaWQiOiJmZHMtaWFtLXBsYXlncm91bmQiLCJhdWQiOlsiZmRzLWlhbS1wbGF5Z3JvdW5kIiwiYXNzZXQtc2VydmljZSJdLCJpc3MiOiJodHRwczovL2lhbS5leGFtcGxlLmNvbS9vYXV0aCIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzA4MDAwMDAwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIGFzc2V0LnJlYWQgYXNzZXQud3JpdGUiLCJzd3Muc2FtYXV0aC50ZW4iOiJ0ZW5hbnQtZGVtby0wMDEiLCJzd3Muc2FtYXV0aC5yb2xlIjpbIlBsYXlncm91bmRBZG1pbiIsIlBsYXlncm91bmRVc2VyIl0sInN3cy5zYW1hdXRoLnRpZXJzIjpbIlByZW1pdW0iXSwianRpIjoibW9jay10b2tlbi1qd3QtaWQtMTIzIn0.' +
  'MOCK_SIGNATURE';

export const mockDecodedHeader = {
  alg: 'RS256',
  typ: 'JWT',
  kid: 'mock-key-1',
};

export const mockDecodedPayload = {
  sub: 'user-1234567890',
  user_name: 'john.doe@example.com',
  email: 'john.doe@example.com',
  client_id: 'fds-iam-playground',
  aud: ['fds-iam-playground', 'asset-service'],
  iss: 'https://iam.example.com/oauth',
  exp: 9999999999,
  iat: 1708000000,
  scope: 'openid profile email asset.read asset.write',
  'sws.samauth.ten': 'tenant-demo-001',
  'sws.samauth.role': ['PlaygroundAdmin', 'PlaygroundUser'],
  'sws.samauth.tiers': ['Premium'],
  jti: 'mock-token-jwt-id-123',
};

export const mockUserInfo = {
  sub: 'user-1234567890',
  name: 'John Doe',
  given_name: 'John',
  family_name: 'Doe',
  email: 'john.doe@example.com',
  email_verified: true,
  userId: 'user-1234567890',
  tenant: 'tenant-demo-001',
  origin: 'uaa',
  previousLoginTime: new Date(Date.now() - 86400000).toISOString(),
  currentLoginTime: new Date().toISOString(),
};

export const mockRoles = ['PlaygroundAdmin', 'PlaygroundUser', 'AssetReader', 'AssetWriter'];

export const mockScopes = [
  'openid',
  'profile',
  'email',
  'asset.read',
  'asset.write',
  'groups',
  'roles',
];

export const mockGroups = {
  applicationGroups: [
    { id: 'app-grp-001', displayName: 'playground-admins', type: 'APPLICATION' },
    { id: 'app-grp-002', displayName: 'playground-users', type: 'APPLICATION' },
    { id: 'app-grp-003', displayName: 'asset-readers', type: 'APPLICATION' },
  ],
  tenantGroups: [
    { id: 'ten-grp-001', displayName: 'tenant-demo-001.admins', type: 'TENANT' },
    { id: 'ten-grp-002', displayName: 'tenant-demo-001.users', type: 'TENANT' },
  ],
  userGroups: [
    { id: 'usr-grp-001', displayName: 'john.doe-personal', type: 'USER' },
  ],
};

export const mockTechUsers = [
  {
    clientId: 'tech-user-asset-sync',
    clientSecret: '••••••••••••',
    description: 'Asset Synchronization Service',
    expiry: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    clientId: 'tech-user-report-gen',
    clientSecret: '••••••••••••',
    description: 'Report Generation Service',
    expiry: new Date(Date.now() + 60 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const mockIdps = [
  {
    id: 'idp-001',
    type: 'OIDC',
    name: 'WebKey',
    issuer: 'https://webkey.example.com/oidc',
    origin: 'webkey',
    active: true,
  },
  {
    id: 'idp-002',
    type: 'SAML',
    name: 'Azure AD',
    issuer: 'https://login.microsoftonline.com/tenant-id/saml2',
    origin: 'azure-ad',
    active: true,
  },
  {
    id: 'idp-003',
    type: 'OIDC',
    name: 'Corporate OIDC',
    issuer: 'https://sso.corp.example.com',
    origin: 'corp-oidc',
    active: false,
  },
  {
    id: 'idp-004',
    type: 'SAML',
    name: 'SAML IdP',
    issuer: 'https://saml.example.com/metadata',
    origin: 'saml-idp',
    active: true,
  },
];

export const mockOAuthClient = {
  clientId: 'fds-iam-playground',
  name: 'FDS IAM Playground',
  audience: ['fds-iam-playground', 'asset-service'],
  grantTypes: ['authorization_code', 'refresh_token', 'client_credentials', 'urn:ietf:params:oauth:grant-type:token-exchange'],
  redirectUris: ['http://localhost:3000/callback', 'https://playground.example.com/callback'],
  scopes: ['openid', 'profile', 'email', 'asset.read', 'asset.write', 'groups', 'roles'],
  tokenEndpointAuthMethod: 'client_secret_basic',
};

export const mockTrustService = {
  whitelistedGroups: [
    'tenant-demo-001.admins',
    'playground-admins',
    'asset-readers',
  ],
  requestedGroups: [
    'playground-admins',
    'asset-writers',
  ],
  subscribedGroups: [
    'playground-admins',
    'asset-readers',
  ],
  grantedRoles: [
    { role: 'PlaygroundAdmin', source: 'playground-admins' },
    { role: 'AssetReader', source: 'asset-readers' },
  ],
};

export const mockSubscriptionTiers = [
  {
    tier: 'Basic',
    active: false,
    features: ['token-view', 'user-info'],
    maxTechUsers: 1,
  },
  {
    tier: 'Standard',
    active: false,
    features: ['token-view', 'user-info', 'token-exchange', 'groups'],
    maxTechUsers: 5,
  },
  {
    tier: 'Premium',
    active: true,
    features: ['token-view', 'user-info', 'token-exchange', 'groups', 'trust-service', 'idp-config', 'tech-users-unlimited'],
    maxTechUsers: -1,
  },
];

