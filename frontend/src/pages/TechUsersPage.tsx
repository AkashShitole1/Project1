import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Button, TextField, IconButton, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Stack, Snackbar,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { getTechUsers, createTechUser, deleteTechUser } from '../services/api';
import { TechUser } from '../types';

export default function TechUsersPage() {
  const [techUsers, setTechUsers] = useState<TechUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState<TechUser | null>(null);
  const [snack, setSnack] = useState('');

  const load = () => {
    setLoading(true);
    getTechUsers()
      .then((d) => { setTechUsers(d.techUsers); setMock(!!d.mock); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const d = await createTechUser(description);
      setNewUser(d.techUser);
      setDescription('');
      setCreateOpen(false);
      load();
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      await deleteTechUser(clientId);
      setSnack(`Tech user ${clientId} deleted`);
      load();
    } catch (e: unknown) {
      setError(String(e));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnack('Copied to clipboard');
  };

  const daysUntilExpiry = (expiry: string) => {
    const diff = new Date(expiry).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

  return (
    <Layout title="Tech Users">
      <PageHeader
        title="Tech Users"
        subtitle="Manage service accounts for machine-to-machine authentication"
        icon={<SmartToyIcon fontSize="large" />}
        badge={mock ? 'Mock' : undefined}
        badgeColor="warning"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Create Tech User
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

      {newUser && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNewUser(null)}>
          <Typography variant="subtitle2">Tech User Created!</Typography>
          <Box sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <div>Client ID: <strong>{newUser.clientId}</strong></div>
            <div>Secret: <strong>{newUser.clientSecret}</strong></div>
            <Typography variant="caption" color="warning.main">⚠️ Save the secret — it won't be shown again!</Typography>
          </Box>
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {techUsers.map((tu) => {
              const days = daysUntilExpiry(tu.expiry);
              return (
                <TableRow key={tu.clientId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{tu.clientId}</Typography>
                      <Tooltip title="Copy Client ID">
                        <IconButton size="small" onClick={() => copyToClipboard(tu.clientId)}>
                          <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{tu.description || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(tu.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">{new Date(tu.expiry).toLocaleDateString()}</Typography>
                      <Chip
                        label={`${days}d`}
                        size="small"
                        color={days < 7 ? 'error' : days < 30 ? 'warning' : 'success'}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Tech User">
                      <IconButton size="small" color="error" onClick={() => handleDelete(tu.clientId)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {techUsers.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>No tech users found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Tech User</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            placeholder="e.g. Asset Sync Service"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating || !description}>
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Layout>
  );
}

