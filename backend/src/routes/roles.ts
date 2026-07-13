import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import { mockRoles, mockDecodedPayload } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ roles: mockRoles, mock: true });
  }

  if (!req.decodedToken) {
    return res.status(401).json({ error: 'No valid token' });
  }

  const payload = req.decodedToken;
  const roles: string[] =
    (payload['sws.samauth.role'] as string[]) ||
    (payload['roles'] as string[]) ||
    (payload['authorities'] as string[]) ||
    [];

  return res.json({ roles, source: 'token' });
});

export default router;

