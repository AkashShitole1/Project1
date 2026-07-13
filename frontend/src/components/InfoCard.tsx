import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
  loading?: boolean;
}

export function InfoRow({ label, value, mono, loading }: InfoRowProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 1, borderBottom: '1px solid rgba(255,255,255,0.04)', '&:last-child': { borderBottom: 'none' } }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 160, fontWeight: 500, flexShrink: 0 }}
      >
        {label}
      </Typography>
      {loading ? (
        <Skeleton width={200} />
      ) : (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontFamily: mono ? '"JetBrains Mono", monospace' : undefined, wordBreak: 'break-all' }}
        >
          {value ?? <span style={{ color: '#4B5563', fontStyle: 'italic' }}>—</span>}
        </Typography>
      )}
    </Box>
  );
}

interface InfoCardProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

export function InfoCard({ children, title, action }: InfoCardProps) {
  return (
    <Box
      sx={{
        bgcolor: '#111827',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {(title || action) && (
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title && (
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {title}
            </Typography>
          )}
          {action}
        </Box>
      )}
      <Box sx={{ px: 2.5, py: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

