import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import { mockScopes, mockDecodedPayload } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ scopes: mockScopes, mock: true });
  }

  if (!req.decodedToken) {
    return res.status(401).json({ error: 'No valid token' });
  }

  const scopeString = (req.decodedToken['scope'] as string) || '';
  const scopes = scopeString.split(' ').filter(Boolean);

  return res.json({ scopes, raw: scopeString });
});

export default router;

