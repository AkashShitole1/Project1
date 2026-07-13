import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Box, Typography, Chip, CircularProgress, Alert, Divider, List, ListItem, ListItemText,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getTrustService } from '../services/api';
import { TrustServiceData } from '../types';

interface GroupListCardProps {
  title: string;
  groups: string[];
  color: string;
  emptyMsg?: string;
}

function GroupListCard({ title, groups, color, emptyMsg = 'None' }: GroupListCardProps) {
  return (
    <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <GroupsIcon sx={{ color, fontSize: 18 }} />
        <Typography variant="subtitle2" fontWeight={600}>{title}</Typography>
        <Chip label={groups.length} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: color, color: '#fff', ml: 'auto' }} />
      </Box>
      <Divider sx={{ mb: 1 }} />
      {groups.length === 0 ? (
        <Typography variant="body2" color="text.secondary">{emptyMsg}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {groups.map((g) => (
            <Chip key={g} label={g} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.72rem', justifyContent: 'flex-start' }} />
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default function TrustExplorer() {
  const [data, setData] = useState<TrustServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrustService()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Trust Explorer">
      <PageHeader
        title="Trust Service Explorer"
        subtitle="Inspect cross-tenant access grants, group mappings and role assignments"
        icon={<VerifiedUserIcon fontSize="large" />}
        badge={data?.mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {data && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <GroupListCard title="Whitelisted Groups" groups={data.whitelistedGroups} color="#4FC3F7" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GroupListCard title="Requested Groups" groups={data.requestedGroups} color="#FFA726" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GroupListCard title="Subscribed Groups" groups={data.subscribedGroups} color="#66BB6A" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2.5, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#CE93D8', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={600}>Granted Roles</Typography>
                <Chip label={data.grantedRoles.length} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#CE93D8', color: '#fff', ml: 'auto' }} />
              </Box>
              <Divider sx={{ mb: 1 }} />
              {data.grantedRoles.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No roles granted</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {data.grantedRoles.map((gr, i) => (
                    <Box key={i} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1, p: 1 }}>
                      <Typography variant="caption" fontWeight={600} color="secondary.main">{gr.role}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                        via {gr.source}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

