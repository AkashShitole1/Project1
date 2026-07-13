import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import { mockSubscriptionTiers, mockDecodedPayload } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, (req: AuthenticatedRequest, res: Response) => {
  const tiers = mockSubscriptionTiers;
  let activeTiersFromToken: string[] = [];

  if (!config.mockMode && req.decodedToken) {
    const tokenTiers = req.decodedToken['sws.samauth.tiers'] as string[] | undefined;
    activeTiersFromToken = tokenTiers || [];
  } else {
    activeTiersFromToken = mockDecodedPayload['sws.samauth.tiers'];
  }

  const enriched = tiers.map((t) => ({
    ...t,
    active: activeTiersFromToken.includes(t.tier),
  }));

  return res.json({ tiers: enriched, activeTiers: activeTiersFromToken, mock: config.mockMode });
});

export default router;

