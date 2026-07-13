import React, { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, Alert } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { InfoCard, InfoRow } from '../components/InfoCard';
import { getOAuthClient } from '../services/api';
import { OAuthClient } from '../types';

export default function OAuthClientPage() {
  const [client, setClient] = useState<OAuthClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    getOAuthClient()
      .then((d) => { setClient(d.client); setMock(!!d.mock); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="OAuth Client">
      <PageHeader
        title="OAuth Client Viewer"
        subtitle="Details about the configured OAuth2 client"
        icon={<AppsIcon fontSize="large" />}
        badge={mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {client && (
        <InfoCard title="Client Configuration">
          <InfoRow label="Client ID" value={client.clientId} mono />
          <InfoRow label="Name" value={client.name} />
          <InfoRow
            label="Audience"
            value={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(Array.isArray(client.audience) ? client.audience : [client.audience]).map((a) => (
                  <Chip key={a} label={a} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                ))}
              </Box>
            }
          />
          <InfoRow
            label="Grant Types"
            value={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {client.grantTypes.map((g) => (
                  <Chip key={g} label={g} size="small" color="info" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} />
                ))}
              </Box>
            }
          />
          <InfoRow
            label="Redirect URIs"
            value={
              <Box>
                {client.redirectUris.map((u) => (
                  <Box key={u} sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.primary', py: 0.2 }}>{u}</Box>
                ))}
              </Box>
            }
          />
          <InfoRow
            label="Scopes"
            value={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {client.scopes.map((s) => (
                  <Chip key={s} label={s} size="small" color="primary" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                ))}
              </Box>
            }
          />
          <InfoRow label="Token Auth Method" value={client.tokenEndpointAuthMethod} mono />
        </InfoCard>
      )}
    </Layout>
  );
}

