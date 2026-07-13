import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Box, Typography, Chip, CircularProgress, Alert, Divider,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { InfoRow } from '../components/InfoCard';
import { getIDPs } from '../services/api';
import { IDP } from '../types';

const IDP_TYPE_COLORS: Record<string, 'primary' | 'secondary' | 'info' | 'warning' | 'success'> = {
  OIDC: 'primary',
  SAML: 'warning',
  LDAP: 'secondary',
  UAA: 'info',
};

export default function IDPViewer() {
  const [idps, setIdps] = useState<IDP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    getIDPs()
      .then((d) => { setIdps(d.idps); setMock(!!d.mock); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Identity Providers">
      <PageHeader
        title="Identity Providers"
        subtitle="Configured identity providers and their metadata"
        icon={<FingerprintIcon fontSize="large" />}
        badge={mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {idps.length} identity provider{idps.length !== 1 ? 's' : ''} configured
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {idps.map((idp) => (
              <Grid item xs={12} md={6} key={idp.id}>
                <Paper
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: idp.active ? 'rgba(102,187,106,0.2)' : 'rgba(255,255,255,0.06)',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>{idp.name}</Typography>
                      <Chip
                        label={idp.type}
                        size="small"
                        color={IDP_TYPE_COLORS[idp.type] || 'default'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {idp.active ? (
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      ) : (
                        <CancelIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      )}
                      <Typography variant="caption" color={idp.active ? 'success.main' : 'text.secondary'}>
                        {idp.active ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <InfoRow label="Origin" value={idp.origin} mono />
                  <InfoRow label="Issuer" value={idp.issuer} mono />
                  <InfoRow label="ID" value={idp.id} mono />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Layout>
  );
}

