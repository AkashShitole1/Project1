import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import * as iamService from '../services/iamService';
import { mockTechUsers } from '../services/mockService';
import config from '../config';

const router = Router();

router.get('/', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ techUsers: mockTechUsers, mock: true });
  }
  if (!req.userToken) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = await iamService.listTechUsers(req.userToken);
    return res.json({ techUsers: data });
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({ error: 'Failed to list tech users', detail: error?.response?.data || String(err) });
  }
});

router.post('/', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    const newUser = {
      clientId: `tech-user-${uuidv4().split('-')[0]}`,
      clientSecret: uuidv4().replace(/-/g, ''),
      description: req.body.description || 'New Tech User',
      expiry: new Date(Date.now() + 90 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    return res.status(201).json({ techUser: newUser, mock: true });
  }
  if (!req.userToken) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = await iamService.createTechUser(req.userToken, req.body.description);
    return res.status(201).json({ techUser: data });
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({ error: 'Failed to create tech user', detail: error?.response?.data || String(err) });
  }
});

router.delete('/:clientId', extractToken, async (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode) {
    return res.json({ deleted: true, clientId: req.params.clientId, mock: true });
  }
  if (!req.userToken) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await iamService.deleteTechUser(req.userToken, req.params.clientId);
    return res.json({ deleted: true, clientId: req.params.clientId });
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return res.status(error?.response?.status || 500).json({ error: 'Failed to delete tech user', detail: error?.response?.data || String(err) });
  }
});

export default router;

