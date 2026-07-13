import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Box, Typography, Chip, CircularProgress, Alert, LinearProgress, Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckIcon from '@mui/icons-material/Check';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getSubscriptions } from '../services/api';
import { SubscriptionTier } from '../types';

const TIER_COLORS: Record<string, { main: string; bg: string }> = {
  Basic: { main: '#9CA3AF', bg: 'rgba(156,163,175,0.08)' },
  Standard: { main: '#4FC3F7', bg: 'rgba(79,195,247,0.08)' },
  Premium: { main: '#FFA726', bg: 'rgba(255,167,38,0.08)' },
};

const FEATURE_LABELS: Record<string, string> = {
  'token-view': 'Token Viewer',
  'user-info': 'User Information',
  'token-exchange': 'Token Exchange',
  'groups': 'Group Management',
  'trust-service': 'Trust Service',
  'idp-config': 'IDP Configuration',
  'tech-users-unlimited': 'Unlimited Tech Users',
};

export default function SubscriptionPage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [activeTiers, setActiveTiers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    getSubscriptions()
      .then((d) => { setTiers(d.tiers); setActiveTiers(d.activeTiers); setMock(!!d.mock); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Subscription">
      <PageHeader
        title="Subscription Tiers"
        subtitle="Current subscription tier and available features from token claims"
        icon={<StarIcon fontSize="large" />}
        badge={mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          {activeTiers.length > 0 && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,167,38,0.08)', border: '1px solid rgba(255,167,38,0.2)', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <StarIcon sx={{ color: '#FFA726' }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>Active Subscription</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  {activeTiers.map((t) => (
                    <Chip key={t} label={t} size="small" color="warning" />
                  ))}
                </Box>
              </Box>
              <Box sx={{ ml: 'auto', fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}>
                sws.samauth.tiers
              </Box>
            </Box>
          )}

          <Grid container spacing={2}>
            {tiers.map((tier) => {
              const colors = TIER_COLORS[tier.tier] || TIER_COLORS.Basic;
              return (
                <Grid item xs={12} md={4} key={tier.tier}>
                  <Paper
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: tier.active ? colors.main : 'rgba(255,255,255,0.06)',
                      borderRadius: 2,
                      bgcolor: tier.active ? colors.bg : '#111827',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tier.active && (
                      <Chip
                        label="ACTIVE"
                        size="small"
                        sx={{
                          position: 'absolute', top: 12, right: 12,
                          bgcolor: colors.main, color: '#000',
                          fontWeight: 700, fontSize: '0.65rem',
                        }}
                      />
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {tier.active ? (
                        <StarIcon sx={{ color: colors.main, fontSize: 28 }} />
                      ) : (
                        <StarBorderIcon sx={{ color: colors.main, fontSize: 28 }} />
                      )}
                      <Typography variant="h5" fontWeight={700} sx={{ color: colors.main }}>
                        {tier.tier}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      {tier.features.map((f) => (
                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckIcon sx={{ color: 'success.main', fontSize: 16 }} />
                          <Typography variant="body2">{FEATURE_LABELS[f] || f}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Tech Users: {tier.maxTechUsers === -1 ? 'Unlimited' : tier.maxTechUsers}
                    </Typography>
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

