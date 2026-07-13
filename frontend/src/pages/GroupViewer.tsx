import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Chip, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Avatar } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppsIcon from '@mui/icons-material/Apps';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getGroups } from '../services/api';
import { GroupData, Group } from '../types';

interface GroupSectionProps {
  title: string;
  groups: Group[];
  icon: React.ReactNode;
  color: string;
}

function GroupSection({ title, groups, icon, color }: GroupSectionProps) {
  return (
    <Accordion defaultExpanded sx={{ bgcolor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px !important', '&:before': { display: 'none' }, mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="subtitle2" fontWeight={600}>{title}</Typography>
          <Chip label={groups.length} size="small" sx={{ height: 18, fontSize: '0.7rem', bgcolor: color, color: '#fff' }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {groups.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No groups in this category</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {groups.map((g) => (
              <Chip
                key={g.id}
                label={g.displayName}
                variant="outlined"
                size="small"
                sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', borderColor: color, color: 'text.primary' }}
              />
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function GroupViewer() {
  const [groups, setGroups] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = groups
    ? groups.applicationGroups.length + groups.tenantGroups.length + groups.userGroups.length
    : 0;

  return (
    <Layout title="Group Viewer">
      <PageHeader
        title="Group Viewer"
        subtitle="User group memberships categorized by type"
        icon={<GroupsIcon fontSize="large" />}
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {groups && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {total} group{total !== 1 ? 's' : ''} found across all categories
              {groups.mock && <Chip label="Mock" size="small" color="warning" sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} />}
            </Typography>
          </Box>

          <GroupSection
            title="Application Groups"
            groups={groups.applicationGroups}
            icon={<AppsIcon />}
            color="#4FC3F7"
          />
          <GroupSection
            title="Tenant Groups"
            groups={groups.tenantGroups}
            icon={<BusinessIcon />}
            color="#CE93D8"
          />
          <GroupSection
            title="User Groups"
            groups={groups.userGroups}
            icon={<PersonIcon />}
            color="#66BB6A"
          />
        </>
      )}
    </Layout>
  );
}

