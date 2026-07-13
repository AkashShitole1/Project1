import { Router, Response } from 'express';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import * as iamService from '../services/iamService';
import { mockGroups } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ ...mockGroups, mock: true });
  }

  if (!req.userToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = await iamService.getGroups(req.userToken);
    // Categorise groups
    const applicationGroups: unknown[] = [];
    const tenantGroups: unknown[] = [];
    const userGroups: unknown[] = [];

    const resources = Array.isArray(data) ? data : data.resources || data.Resources || [];
    for (const grp of resources) {
      const dn: string = grp.displayName || '';
      if (dn.includes('personal') || grp.type === 'USER') {
        userGroups.push(grp);
      } else if (dn.match(/tenant-/) || grp.type === 'TENANT') {
        tenantGroups.push(grp);
      } else {
        applicationGroups.push(grp);
      }
    }

    return res.json({ applicationGroups, tenantGroups, userGroups });
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({
      error: 'Failed to fetch groups',
      detail: error?.response?.data || String(err),
    });
  }
});

export default router;

