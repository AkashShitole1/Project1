import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import * as iamService from '../services/iamService';
import { mockIdps } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ idps: mockIdps, mock: true });
  }
  if (!req.userToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const data = await iamService.getIdps(req.userToken);
    return res.json({ idps: Array.isArray(data) ? data : data.resources || [] });
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch IDPs',
      detail: error?.response?.data || String(err),
    });
  }
});

export default router;

