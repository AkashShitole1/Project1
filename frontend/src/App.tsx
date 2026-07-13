import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TokenViewer from './pages/TokenViewer';
import UserInfoPage from './pages/UserInfoPage';
import RolesPage from './pages/RolesPage';
import ScopesPage from './pages/ScopesPage';
import GroupViewer from './pages/GroupViewer';
import OAuthClientPage from './pages/OAuthClientPage';
import IDPViewer from './pages/IDPViewer';
import TechUsersPage from './pages/TechUsersPage';
import TokenExchangePage from './pages/TokenExchangePage';
import TrustExplorer from './pages/TrustExplorer';
import SubscriptionPage from './pages/SubscriptionPage';
import CallbackPage from './pages/CallbackPage';

export default function App() {
  const pathnameSegments = window.location.pathname.split('/').filter(Boolean);
  const appRoutes = new Set([
    'login',
    'callback',
    'token',
    'user',
    'roles',
    'scopes',
    'groups',
    'oauth-client',
    'idp',
    'tech-users',
    'token-exchange',
    'trust-explorer',
    'subscription',
  ]);
  const routerBase = pathnameSegments.length > 0 && !appRoutes.has(pathnameSegments[0])
    ? `/${pathnameSegments[0]}`
    : '/';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={routerBase}>
        <AuthProvider>
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/token" element={<TokenViewer />} />
            <Route path="/user" element={<UserInfoPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/scopes" element={<ScopesPage />} />
            <Route path="/groups" element={<GroupViewer />} />
            <Route path="/oauth-client" element={<OAuthClientPage />} />
            <Route path="/idp" element={<IDPViewer />} />
            <Route path="/tech-users" element={<TechUsersPage />} />
            <Route path="/token-exchange" element={<TokenExchangePage />} />
            <Route path="/trust-explorer" element={<TrustExplorer />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}


