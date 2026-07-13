import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, extractToken } from '../middleware/auth';
import { mockAccessToken, mockDecodedHeader, mockDecodedPayload } from '../services/mockService';
import config from '../config';

const router = Router();

// Decode a token (pass token in body or use Authorization header)
router.post('/decode', extractToken, (req: AuthenticatedRequest, res: Response) => {
  const token = req.body.token || req.userToken;

  if (config.mockMode && !token) {
    return res.json({
      raw: mockAccessToken,
      header: mockDecodedHeader,
      payload: mockDecodedPayload,
      mock: true,
    });
  }

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return res.status(400).json({ error: 'Invalid JWT format' });
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'));
    const payload = jwt.decode(token) as Record<string, unknown>;

    return res.json({ raw: token, header, payload });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to decode token', detail: String(err) });
  }
});

// Return info about the current token from Authorization header
router.get('/info', extractToken, (req: AuthenticatedRequest, res: Response) => {
  if (config.mockMode && !req.userToken) {
    return res.json({
      raw: mockAccessToken,
      header: mockDecodedHeader,
      payload: mockDecodedPayload,
      mock: true,
    });
  }

  if (!req.userToken) {
    return res.status(401).json({ error: 'No token' });
  }

  return res.json({
    raw: req.userToken,
    header: (() => {
      const parts = req.userToken!.split('.');
      return JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'));
    })(),
    payload: req.decodedToken,
  });
});

export default router;

