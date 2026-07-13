import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import * as iamService from '../services/iamService';
import { mockUserInfo } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/me', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ ...mockUserInfo, mock: true });
  }

  if (!req.userToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = await iamService.getUserMe(req.userToken);
    return res.json(data);
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch user/me',
      detail: error?.response?.data || String(err),
    });
  }
});

export default router;

