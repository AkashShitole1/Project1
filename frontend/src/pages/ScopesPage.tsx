import React, { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, Alert, Typography, Paper, Grid, Tooltip } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getScopes } from '../services/api';

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  openid: 'Enable OIDC — required for ID token',
  profile: 'Access user profile information',
  email: 'Access user email address',
  'asset.read': 'Read assets from the asset service',
  'asset.write': 'Create/update assets in the asset service',
  groups: 'Access user group memberships',
  roles: 'Access user role assignments',
  offline_access: 'Enable refresh token (offline access)',
};

const SCOPE_CATEGORIES: Record<string, string[]> = {
  'OIDC Standard': ['openid', 'profile', 'email', 'offline_access'],
  'Asset Service': ['asset.read', 'asset.write'],
  'IAM': ['groups', 'roles'],
};

function categorizeScopeColor(scope: string): 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default' {
  if (['openid', 'profile', 'email', 'offline_access'].includes(scope)) return 'primary';
  if (scope.endsWith('.read')) return 'success';
  if (scope.endsWith('.write')) return 'warning';
  if (['groups', 'roles'].includes(scope)) return 'secondary';
  return 'default';
}

export default function ScopesPage() {
  const [scopes, setScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    getScopes()
      .then((d) => { setScopes(d.scopes); setMock(!!d.mock); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Scopes">
      <PageHeader
        title="OAuth Scopes"
        subtitle="Active scopes granted in the current access token"
        icon={<TuneIcon fontSize="large" />}
        badge={mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {scopes.map((s) => (
              <Tooltip key={s} title={SCOPE_DESCRIPTIONS[s] || 'Custom scope'} arrow>
                <Chip
                  label={s}
                  color={categorizeScopeColor(s)}
                  variant="filled"
                  icon={<LockOpenIcon />}
                  sx={{ fontFamily: '"JetBrains Mono", monospace' }}
                />
              </Tooltip>
            ))}
          </Box>

          <Grid container spacing={2}>
            {Object.entries(SCOPE_CATEGORIES).map(([category, catScopes]) => {
              const activeInCat = catScopes.filter((s) => scopes.includes(s));
              const inactiveInCat = catScopes.filter((s) => !scopes.includes(s));
              return (
                <Grid item xs={12} md={4} key={category}>
                  <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1.5}>{category}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {catScopes.map((s) => (
                        <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: scopes.includes(s) ? 'success.main' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: scopes.includes(s) ? 'text.primary' : 'text.secondary' }}>
                              {s}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>
                              {SCOPE_DESCRIPTIONS[s] || ''}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Layout>
  );
}

