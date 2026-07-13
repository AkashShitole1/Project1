import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Chip, Divider, IconButton, Tooltip, Tab, Tabs,
  CircularProgress, Alert, TextField, Stack, Button, Snackbar, Grid,
} from '@mui/material';
import TokenIcon from '@mui/icons-material/Token';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import JsonViewer from '../components/JsonViewer';
import { InfoCard, InfoRow } from '../components/InfoCard';
import { getTokenInfo } from '../services/api';
import { TokenInfo } from '../types';

const HIGHLIGHT_CLAIMS = ['sub', 'user_name', 'email', 'scope', 'client_id', 'aud', 'iss', 'exp', 'iat', 'jti', 'sws.samauth.ten', 'sws.samauth.role', 'sws.samauth.tiers'];

export default function TokenViewer() {
  const { accessToken } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    getTokenInfo()
      .then(setTokenInfo)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [accessToken]);

  const handleCopyToken = async () => {
    if (tokenInfo?.raw) {
      await navigator.clipboard.writeText(tokenInfo.raw);
      setCopied(true);
      setSnackOpen(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatClaimValue = (val: unknown): string => {
    if (typeof val === 'number' && (String(val).length === 10 || String(val).length === 13)) {
      const d = new Date(val * (String(val).length === 10 ? 1000 : 1));
      return `${val} (${d.toLocaleString()})`;
    }
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
  };

  return (
    <Layout title="Token Viewer">
      <PageHeader
        title="Token Viewer"
        subtitle="Inspect and decode your access token and claims"
        icon={<TokenIcon fontSize="large" />}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : tokenInfo ? (
        <Stack spacing={3}>
          {/* Raw Token */}
          <InfoCard
            title="Raw Access Token"
            action={
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh">
                  <IconButton size="small" onClick={load}><RefreshIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title={copied ? 'Copied!' : 'Copy Token'}>
                  <IconButton size="small" onClick={handleCopyToken} sx={{ color: copied ? 'success.main' : 'text.secondary' }}>
                    {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Stack>
            }
          >
            <Box
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.72rem',
                wordBreak: 'break-all',
                color: '#9CA3AF',
                lineHeight: 1.8,
                py: 1,
              }}
            >
              {(() => {
                const parts = tokenInfo.raw.split('.');
                return (
                  <>
                    <span style={{ color: '#ff7b72' }}>{parts[0]}</span>
                    <span style={{ color: '#8b949e' }}>.</span>
                    <span style={{ color: '#79c0ff' }}>{parts[1]}</span>
                    <span style={{ color: '#8b949e' }}>.</span>
                    <span style={{ color: '#a5d6ff' }}>{parts[2]}</span>
                  </>
                );
              })()}
            </Box>
          </InfoCard>

          {/* Tabs: Header / Payload / Claims */}
          <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', mb: 2 }}>
              <Tab label="Header" />
              <Tab label="Payload" />
              <Tab label="Key Claims" />
            </Tabs>

            {tab === 0 && <JsonViewer data={tokenInfo.header} title="Decoded Header" />}
            {tab === 1 && <JsonViewer data={tokenInfo.payload} title="Decoded Payload" />}
            {tab === 2 && (
              <InfoCard title="Key Claims">
                {HIGHLIGHT_CLAIMS.map((claim) => {
                  const val = tokenInfo.payload[claim];
                  if (val === undefined) return null;
                  return (
                    <InfoRow
                      key={claim}
                      label={claim}
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }}>
                            {formatClaimValue(val)}
                          </Typography>
                          {claim === 'exp' && (
                            <Chip
                              label={(val as number) > Date.now() / 1000 ? 'Valid' : 'Expired'}
                              size="small"
                              color={(val as number) > Date.now() / 1000 ? 'success' : 'error'}
                            />
                          )}
                        </Box>
                      }
                      mono
                    />
                  );
                })}
              </InfoCard>
            )}
          </Box>
        </Stack>
      ) : null}

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="Token copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Layout>
  );
}

