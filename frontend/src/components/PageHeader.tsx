import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export default function PageHeader({ title, subtitle, icon, badge, badgeColor = 'primary' }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      {icon && (
        <Box sx={{ color: 'primary.main', mt: 0.5, fontSize: 32, display: 'flex' }}>
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {badge && (
            <Chip label={badge} size="small" color={badgeColor} variant="outlined" sx={{ fontSize: '0.7rem' }} />
          )}
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

