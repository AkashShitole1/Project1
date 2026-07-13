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
  const baseUrl = import.meta.env.BASE_URL || '/';
  const routerBase = baseUrl.endsWith('/') && baseUrl.length > 1 ? baseUrl.slice(0, -1) : baseUrl;

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


