import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import config from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import tokenRoutes from './routes/token';
import userinfoRoutes from './routes/userinfo';
import usersRoutes from './routes/users';
import groupsRoutes from './routes/groups';
import rolesRoutes from './routes/roles';
import scopesRoutes from './routes/scopes';
import idpRoutes from './routes/idp';
import techUsersRoutes from './routes/techUsers';
import tokenExchangeRoutes from './routes/tokenExchange';
import trustServiceRoutes from './routes/trustService';
import subscriptionsRoutes from './routes/subscriptions';
import oauthClientRoutes from './routes/oauthClient';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    mode: config.mockMode ? 'mock' : 'live',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Config endpoint (non-sensitive)
app.get('/api/config', (_req, res) => {
  res.json({
    mockMode: config.mockMode,
    oidcIssuer: config.oidcIssuer,
    oidcClientId: config.oidcClientId,
    oidcRedirectUri: config.oidcRedirectUri,
    oidcScopes: config.oidcScopes,
    iamBaseUrl: config.iamBaseUrl,
  });
});

// API Routes
app.use('/api/token', tokenRoutes);
app.use('/api/userinfo', userinfoRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/scopes', scopesRoutes);
app.use('/api/idp', idpRoutes);
app.use('/api/tech-users', techUsersRoutes);
app.use('/api/token/exchange', tokenExchangeRoutes);
app.use('/api/trust-service', trustServiceRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/oauth-client', oauthClientRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`\n🚀 FDS IAM Playground Backend`);
  console.log(`   Port    : ${config.port}`);
  console.log(`   Mode    : ${config.mockMode ? '🎭 MOCK' : '🔴 LIVE'}`);
  console.log(`   Issuer  : ${config.oidcIssuer || '(not set)'}`);
  console.log(`   IAM URL : ${config.iamBaseUrl || '(not set)'}`);
  console.log(`   CORS    : ${config.corsOrigin}`);
  console.log('');
});

export default app;

