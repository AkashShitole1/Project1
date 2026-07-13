import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Tooltip, Chip, Collapse,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TokenIcon from '@mui/icons-material/Token';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TuneIcon from '@mui/icons-material/Tune';
import GroupsIcon from '@mui/icons-material/Groups';
import AppsIcon from '@mui/icons-material/Apps';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import { useAuth } from '../context/AuthContext';

export const DRAWER_WIDTH = 260;

const navItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/token', label: 'Token Viewer', icon: <TokenIcon /> },
  { path: '/user', label: 'User Info', icon: <PersonIcon /> },
  { path: '/roles', label: 'Roles', icon: <AdminPanelSettingsIcon /> },
  { path: '/scopes', label: 'Scopes', icon: <TuneIcon /> },
  { path: '/groups', label: 'Groups', icon: <GroupsIcon /> },
  { path: '/oauth-client', label: 'OAuth Client', icon: <AppsIcon /> },
  { path: '/idp', label: 'Identity Providers', icon: <FingerprintIcon /> },
  { path: '/tech-users', label: 'Tech Users', icon: <SmartToyIcon /> },
  { path: '/token-exchange', label: 'Token Exchange', icon: <SwapHorizIcon /> },
  { path: '/trust-explorer', label: 'Trust Explorer', icon: <VerifiedUserIcon /> },
  { path: '/subscription', label: 'Subscription', icon: <StarIcon /> },
];

export default function NavDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMockMode, isAuthenticated } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo / Branding */}
      <Box sx={{ px: 2.5, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ShieldIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={700} color="primary.main" lineHeight={1.2}>
            FDS IAM
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1}>
            Playground
          </Typography>
        </Box>
      </Box>

      {isMockMode && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Chip
            label="MOCK MODE"
            size="small"
            color="warning"
            sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700, letterSpacing: '0.05em' }}
          />
        </Box>
      )}

      <Divider sx={{ mb: 1 }} />

      <List dense sx={{ flex: 1, px: 0 }}>
        {navItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => navigate(item.path)}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: selected ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: selected ? 600 : 400,
                  color: selected ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          FDS IAM Playground v1.0.0
        </Typography>
        <Typography variant="caption" color={isAuthenticated ? 'success.main' : 'error.main'}>
          {isAuthenticated ? '● Connected' : '○ Not authenticated'}
        </Typography>
      </Box>
    </Drawer>
  );
}

