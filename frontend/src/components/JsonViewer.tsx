import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Paper, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

interface JsonViewerProps {
  data: unknown;
  title?: string;
  copyable?: boolean;
  maxHeight?: number | string;
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

export default function JsonViewer({ data, title, copyable = true, maxHeight = 400 }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        bgcolor: '#0D1117',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {(title || copyable) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            bgcolor: '#0A0E1A',
          }}
        >
          {title && (
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {title}
            </Typography>
          )}
          {copyable && (
            <Tooltip title={copied ? 'Copied!' : 'Copy JSON'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? 'success.main' : 'text.secondary' }}>
                {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
      <Box
        sx={{
          p: 2,
          maxHeight,
          overflowY: 'auto',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          '& .json-key': { color: '#79c0ff' },
          '& .json-string': { color: '#a5d6ff' },
          '& .json-number': { color: '#d2a8ff' },
          '& .json-boolean': { color: '#ff7b72' },
          '& .json-null': { color: '#8b949e' },
        }}
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonStr) }}
      />
    </Paper>
  );
}

