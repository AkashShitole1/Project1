import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function CallbackPage() {
  const { handleCallback, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleCallback().then(() => navigate('/'));
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        gap: 2,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ maxWidth: 480 }}>
          Authentication failed: {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Completing authentication…
          </Typography>
        </>
      )}
    </Box>
  );
}

