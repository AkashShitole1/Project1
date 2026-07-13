import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper, Chip, Divider, CircularProgress, Stack } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import TokenIcon from '@mui/icons-material/Token';
import LayersIcon from '@mui/icons-material/Layers';
import BusinessIcon from '@mui/icons-material/Business';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getTokenInfo } from '../services/api';
import { TokenInfo } from '../types';

export default function Dashboard() {
  const { user, isAuthenticated, accessToken, isMockMode, config } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTokenInfo().then(setTokenInfo).catch(console.error).finally(() => setLoading(false));
  }, [accessToken]);

  const payload = tokenInfo?.payload;
  const tenant = payload?.['sws.samauth.ten'] as string || user?.tenant || '—';
  const roles = (payload?.['sws.samauth.role'] as string[]) || [];
  const tiers = (payload?.['sws.samauth.tiers'] as string[]) || [];
  const scopes = ((payload?.scope as string) || '').split(' ').filter(Boolean);

  const statsCards = [
    { label: 'Roles', value: roles.length, icon: <LayersIcon />, color: '#CE93D8' },
    { label: 'Scopes', value: scopes.length, icon: <TokenIcon />, color: '#4FC3F7' },
    { label: 'Subscription Tiers', value: tiers.length, icon: <StarIcon />, color: '#FFA726' },
  ];

  return (
    <Layout title="Dashboard">
      <PageHeader
        title="Home Dashboard"
        subtitle="Overview of your current authentication context"
        icon={<DashboardIcon fontSize="large" />}
        badge={isMockMode ? 'Mock Mode' : 'Live'}
        badgeColor={isMockMode ? 'warning' : 'success'}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Current User Card */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PersonIcon sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight={600}>Current User</Typography>
              </Box>
              <Stack spacing={1.5}>
                <DashboardInfoRow label="Email" value={payload?.email as string || user?.email} />
                <DashboardInfoRow label="User Sub" value={payload?.sub || user?.sub} mono />
                <DashboardInfoRow label="Username" value={payload?.user_name as string} />
                <DashboardInfoRow label="Tenant" value={tenant} mono />
                <DashboardInfoRow label="Origin" value={user?.origin} mono />
              </Stack>
            </Paper>
          </Grid>

          {/* Token Context Card */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <TokenIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="subtitle1" fontWeight={600}>Token Context</Typography>
              </Box>
              <Stack spacing={1.5}>
                <DashboardInfoRow label="Client ID" value={payload?.client_id as string || config?.oidcClientId} mono />
                <DashboardInfoRow label="Audience" value={Array.isArray(payload?.aud) ? (payload?.aud as string[]).join(', ') : payload?.aud as string} mono />
                <DashboardInfoRow label="Issuer" value={payload?.iss as string || config?.oidcIssuer} mono />
                <DashboardInfoRow label="Environment" value={config?.iamBaseUrl ? new URL(config.iamBaseUrl).hostname : '—'} />
                <DashboardInfoRow
                  label="Token Expiry"
                  value={payload?.exp ? new Date((payload.exp as number) * 1000).toLocaleString() : '—'}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Stats Row */}
          {statsCards.map((card) => (
            <Grid item xs={12} sm={4} key={card.label}>
              <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, textAlign: 'center' }}>
                <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
                <Typography variant="h3" fontWeight={700} sx={{ color: card.color }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
              </Paper>
            </Grid>
          ))}

          {/* Roles */}
          {roles.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1.5}>Roles</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {roles.map((r) => (
                    <Chip key={r} label={r} size="small" color="secondary" variant="outlined" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Subscription Tiers */}
          {tiers.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1.5}>Subscription Tiers</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tiers.map((t) => (
                    <Chip key={t} label={t} size="small" color="warning" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Scopes */}
          {scopes.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1.5}>Active Scopes</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {scopes.map((s) => (
                    <Chip key={s} label={s} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Layout>
  );
}

function DashboardInfoRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, flexShrink: 0, pt: 0.2 }}>
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontFamily: mono ? '"JetBrains Mono", monospace' : undefined, wordBreak: 'break-all', color: value ? 'text.primary' : 'text.secondary' }}
      >
        {value || '—'}
      </Typography>
    </Box>
  );
}

