import React, { useEffect, useState } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { InfoCard, InfoRow } from '../components/InfoCard';
import { getUserMe } from '../services/api';
import { UserInfo } from '../types';

export default function UserInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserMe()
      .then(setUser)
      .catch((e) => setError(e?.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="User Information">
      <PageHeader
        title="User Information"
        subtitle="Details about the currently authenticated user"
        icon={<PersonIcon fontSize="large" />}
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {user && (
        <InfoCard title="User Profile">
          <InfoRow label="Name" value={user.name || `${user.given_name || ''} ${user.family_name || ''}`.trim() || '—'} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Email Verified" value={user.email_verified !== undefined ? String(user.email_verified) : '—'} />
          <InfoRow label="User ID / Sub" value={user.userId || user.sub} mono />
          <InfoRow label="Tenant" value={user.tenant} mono />
          <InfoRow label="Origin (IdP)" value={user.origin} mono />
          <InfoRow label="Previous Login" value={user.previousLoginTime ? new Date(user.previousLoginTime).toLocaleString() : '—'} />
          <InfoRow label="Current Login" value={user.currentLoginTime ? new Date(user.currentLoginTime).toLocaleString() : '—'} />
        </InfoCard>
      )}
    </Layout>
  );
}

