import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import * as iamService from '../services/iamService';
import { mockDecodedPayload } from '../services/mockService';
import config from '../config';

const router = Router();

router.post('/', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  const { sourceToken, providerTenant } = req.body;

  if (!sourceToken || !providerTenant) {
    return res.status(400).json({ error: 'sourceToken and providerTenant are required' });
  }

  let originalClaims: Record<string, unknown>;
  try {
    originalClaims = (jwt.decode(sourceToken) as Record<string, unknown>) || {};
  } catch {
    return res.status(400).json({ error: 'Invalid source token format' });
  }

  if (config.mockMode) {
    const exchangedClaims = {
      ...mockDecodedPayload,
      'sws.samauth.ten': providerTenant,
      sub: `exchanged-${originalClaims.sub || 'user'}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: `exchanged-token-${Date.now()}`,
    };
    return res.json({
      originalClaims,
      exchangedClaims,
      exchangedToken: 'mock-exchanged-token.' + Buffer.from(JSON.stringify(exchangedClaims)).toString('base64') + '.mock-sig',
      mock: true,
    });
  }

  if (!req.userToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await iamService.exchangeToken(req.userToken, sourceToken, providerTenant);
    const exchangedToken = result.access_token;
    const exchangedClaims = jwt.decode(exchangedToken) as Record<string, unknown>;
    return res.json({ originalClaims, exchangedClaims, exchangedToken });
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({
      error: 'Token exchange failed',
      detail: error?.response?.data || String(err),
    });
  }
});

export default router;

