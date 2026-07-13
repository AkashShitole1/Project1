import React, { useEffect, useState } from 'react';
import { Grid, Paper, Box, Typography, Chip, CircularProgress, Alert } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getRoles } from '../services/api';

const ROLE_COLORS: Record<string, 'error' | 'warning' | 'success' | 'info' | 'primary' | 'secondary' | 'default'> = {
  Admin: 'error',
  admin: 'error',
  PlaygroundAdmin: 'error',
  PlaygroundUser: 'primary',
  AssetReader: 'success',
  AssetWriter: 'warning',
};

function getRoleColor(role: string) {
  for (const [key, color] of Object.entries(ROLE_COLORS)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'default';
}

function getRoleIcon(role: string) {
  if (role.toLowerCase().includes('admin')) return <StarIcon />;
  if (role.toLowerCase().includes('user')) return <PersonIcon />;
  return <AdminPanelSettingsIcon />;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    getRoles()
      .then((d) => { setRoles(d.roles); setMock(!!d.mock); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Roles">
      <PageHeader
        title="Roles"
        subtitle="All roles assigned to the current user via the access token"
        icon={<AdminPanelSettingsIcon fontSize="large" />}
        badge={mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {roles.length} role{roles.length !== 1 ? 's' : ''} found
            </Typography>
            <Chip label="sws.samauth.role" size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} />
          </Box>

          <Grid container spacing={2}>
            {roles.map((role) => (
              <Grid item xs={12} sm={6} md={4} key={role}>
                <Paper
                  sx={{
                    p: 2.5,
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'rgba(79,195,247,0.3)' },
                  }}
                >
                  <Box sx={{ color: `${getRoleColor(role)}.main`, display: 'flex' }}>
                    {getRoleIcon(role)}
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {role}
                    </Typography>
                    <Chip
                      label={getRoleColor(role) === 'error' ? 'Admin' : getRoleColor(role) === 'success' ? 'Read' : 'User'}
                      size="small"
                      color={getRoleColor(role)}
                      sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}

            {roles.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <Typography color="text.secondary">No roles found in token</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Layout>
  );
}

