import React from 'react';
import { Box, Typography, Button, Paper, Chip, Divider, Avatar, Stack } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function LoginPage() {
  const { isAuthenticated, isLoading, user, login, logout, isMockMode, config } = useAuth();

  return (
    <Layout title="Login">
      <PageHeader
        title="Authentication"
        subtitle="Login with FDS IAM using OAuth2 / OIDC"
        icon={<ShieldIcon fontSize="large" />}
      />

      <Box sx={{ maxWidth: 600 }}>
        {/* Status Card */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            border: '1px solid',
            borderColor: isAuthenticated ? 'rgba(102,187,106,0.3)' : 'rgba(255,255,255,0.06)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {isAuthenticated ? (
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />
            ) : (
              <CancelIcon sx={{ color: 'text.secondary', fontSize: 32 }} />
            )}
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAuthenticated
                  ? `Logged in as ${user?.email || user?.name || 'Unknown'}`
                  : 'Click Login to authenticate with FDS IAM'}
              </Typography>
            </Box>
          </Box>

          {isAuthenticated && user && (
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1.5, p: 2, mb: 2 }}>
              <Stack spacing={1}>
                {user.name && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>Name</Typography>
                    <Typography variant="caption">{user.name}</Typography>
                  </Box>
                )}
                {user.email && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>Email</Typography>
                    <Typography variant="caption">{user.email}</Typography>
                  </Box>
                )}
                {user.sub && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>Sub</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{user.sub}</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}

          <Stack direction="row" spacing={2}>
            {!isAuthenticated ? (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={login}
                disabled={isLoading}
                size="large"
              >
                {isLoading ? 'Loading…' : 'Login with FDS IAM'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={logout}
                color="error"
              >
                Logout
              </Button>
            )}
          </Stack>
        </Paper>

        {/* OIDC Config Info */}
        <Paper sx={{ p: 3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
            OIDC Configuration
          </Typography>
          <Stack spacing={1}>
            <InfoLine label="Issuer" value={config?.oidcIssuer || '(not configured)'} />
            <InfoLine label="Client ID" value={config?.oidcClientId || '(not configured)'} />
            <InfoLine label="Redirect URI" value={config?.oidcRedirectUri || '(not configured)'} />
            <InfoLine label="Scopes" value={config?.oidcScopes || '(not configured)'} />
            <InfoLine label="IAM Base URL" value={config?.iamBaseUrl || '(not configured)'} />
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={isMockMode ? '🎭 Mock Mode Active' : '🔴 Live Mode'}
                size="small"
                color={isMockMode ? 'warning' : 'success'}
                variant="outlined"
              />
              <Chip
                label="Authorization Code + PKCE"
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Layout>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', color: value.startsWith('(') ? 'text.secondary' : 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  );
}

