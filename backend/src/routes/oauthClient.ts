import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import { mockOAuthClient } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode || !req.decodedToken) {
    return res.json({ client: mockOAuthClient, mock: true });
  }

  const payload = req.decodedToken;
  const client = {
    clientId: payload['client_id'] || payload['azp'] || config.oidcClientId,
    audience: payload['aud'],
    grantTypes: ['authorization_code', 'refresh_token'],
    redirectUris: [config.oidcRedirectUri],
    scopes: ((payload['scope'] as string) || '').split(' ').filter(Boolean),
    tokenEndpointAuthMethod: 'client_secret_basic',
  };

  return res.json({ client });
});

export default router;

