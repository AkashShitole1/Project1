import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tooltip, Avatar, Chip, Badge } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import ShieldIcon from '@mui/icons-material/Shield';
import NavDrawer, { DRAWER_WIDTH } from './NavDrawer';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { isAuthenticated, user, login, logout, isMockMode } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavDrawer />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(17,24,39,0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            ml: 0,
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1, color: 'text.primary' }}>
              {title || 'FDS IAM Playground'}
            </Typography>

            {isMockMode && (
              <Chip
                label="🎭 Mock Mode"
                size="small"
                color="warning"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}

            {isAuthenticated && user?.email && (
              <Tooltip title={user.email}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: '0.8rem' }}>
                  {user.email[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            )}

            {isAuthenticated ? (
              <Tooltip title="Logout">
                <IconButton onClick={logout} color="inherit" size="small">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Login">
                <IconButton onClick={login} color="primary" size="small">
                  <LoginIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

