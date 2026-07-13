import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button, TextField, Grid, CircularProgress,
  Alert, Stack, Divider, Tabs, Tab,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import JsonViewer from '../components/JsonViewer';
import { exchangeToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TokenExchangePage() {
  const { accessToken } = useAuth();
  const [sourceToken, setSourceToken] = useState('');
  const [providerTenant, setProviderTenant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    originalClaims: Record<string, unknown>;
    exchangedClaims: Record<string, unknown>;
    exchangedToken: string;
    mock?: boolean;
  } | null>(null);
  const [tab, setTab] = useState(0);

  const handleExchange = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await exchangeToken(sourceToken || accessToken || '', providerTenant);
      setResult(data);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string; detail?: unknown } }; message?: string };
      setError(err?.response?.data?.error || err?.message || 'Token exchange failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Token Exchange">
      <PageHeader
        title="Token Exchange"
        subtitle="Exchange tokens across tenants using RFC 8693 Token Exchange"
        icon={<SwapHorizIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>Exchange Configuration</Typography>

            <Stack spacing={2}>
              <TextField
                label="Source Token"
                value={sourceToken}
                onChange={(e) => setSourceToken(e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder="Leave empty to use current access token"
                helperText="The token to exchange (subject_token)"
                InputProps={{ sx: { fontFamily: 'monospace', fontSize: '0.75rem' } }}
              />

              <TextField
                label="Provider Tenant"
                value={providerTenant}
                onChange={(e) => setProviderTenant(e.target.value)}
                fullWidth
                placeholder="e.g. tenant-partner-001"
                helperText="Target tenant for the exchanged token"
              />

              <Button
                variant="contained"
                onClick={handleExchange}
                disabled={loading || !providerTenant}
                startIcon={loading ? <CircularProgress size={16} /> : <SwapHorizIcon />}
                size="large"
              >
                {loading ? 'Exchanging…' : 'Exchange Token'}
              </Button>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          {result ? (
            <Paper sx={{ p: 3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>Exchange Result</Typography>
                {result.mock && (
                  <Typography variant="caption" color="warning.main">🎭 Mock</Typography>
                )}
              </Box>

              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 2 }}>
                <Tab label="Original Claims" />
                <Tab label="Exchanged Claims" />
                <Tab label="Diff" />
              </Tabs>

              {tab === 0 && (
                <JsonViewer data={result.originalClaims} title="Original Token Claims" />
              )}
              {tab === 1 && (
                <JsonViewer data={result.exchangedClaims} title="Exchanged Token Claims" />
              )}
              {tab === 2 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    Changed claims between original and exchanged token:
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {Object.keys({ ...result.originalClaims, ...result.exchangedClaims }).map((key) => {
                      const orig = JSON.stringify(result.originalClaims[key]);
                      const exch = JSON.stringify(result.exchangedClaims[key]);
                      if (orig === exch) return null;
                      return (
                        <Box key={key} sx={{ mb: 1, p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1 }}>
                          <Typography variant="caption" color="primary.main" fontWeight={600}>{key}</Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Box>
                              <Typography variant="caption" color="error.main" sx={{ fontSize: '0.65rem' }}>BEFORE</Typography>
                              <Typography variant="caption" display="block" color="error.light">{orig}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="success.main" sx={{ fontSize: '0.65rem' }}>AFTER</Typography>
                              <Typography variant="caption" display="block" color="success.light">{exch}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 4,
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 2,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <SwapHorizIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3 }} />
              <Typography color="text.secondary">
                Configure the token exchange and click "Exchange Token" to see the result
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}

