import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from 'oidc-client-ts';
import { getAppConfig, setAuthToken } from '../services/api';
import { initOidc, getUser, signinRedirect, signoutRedirect, signinCallback as doSigninCallback } from '../services/auth';
import { AppConfig, AuthState } from '../types';

interface AuthContextValue extends AuthState {
  config: AppConfig | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: () => Promise<void>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USER: AuthState = {
  isAuthenticated: true,
  isLoading: false,
  accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1vY2sta2V5LTEifQ.eyJzdWIiOiJ1c2VyLTEyMzQ1Njc4OTAiLCJ1c2VyX25hbWUiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJjbGllbnRfaWQiOiJmZHMtaWFtLXBsYXlncm91bmQiLCJhdWQiOlsiZmRzLWlhbS1wbGF5Z3JvdW5kIiwiYXNzZXQtc2VydmljZSJdLCJpc3MiOiJodHRwczovL2lhbS5leGFtcGxlLmNvbS9vYXV0aCIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzA4MDAwMDAwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIGFzc2V0LnJlYWQgYXNzZXQud3JpdGUiLCJzd3Muc2FtYXV0aC50ZW4iOiJ0ZW5hbnQtZGVtby0wMDEiLCJzd3Muc2FtYXV0aC5yb2xlIjpbIlBsYXlncm91bmRBZG1pbiIsIlBsYXlncm91bmRVc2VyIl0sInN3cy5zYW1hdXRoLnRpZXJzIjpbIlByZW1pdW0iXSwianRpIjoibW9jay10b2tlbi1qd3QtaWQtMTIzIn0.MOCK_SIGNATURE',
  idToken: null,
  user: {
    sub: 'user-1234567890',
    name: 'John Doe',
    email: 'john.doe@example.com',
    tenant: 'tenant-demo-001',
    origin: 'uaa',
    userId: 'user-1234567890',
    previousLoginTime: new Date(Date.now() - 86400000).toISOString(),
    currentLoginTime: new Date().toISOString(),
  },
  error: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
    idToken: null,
    user: null,
    error: null,
  });

  useEffect(() => {
    async function init() {
      try {
        const cfg = await getAppConfig();
        setAppConfig(cfg);

        if (cfg.mockMode) {
          setAuthToken(MOCK_USER.accessToken);
          setAuthState({ ...MOCK_USER });
          return;
        }

        if (cfg.oidcIssuer && cfg.oidcClientId) {
          initOidc(cfg);
          const user = await getUser();
          if (user && !user.expired) {
            setAuthToken(user.access_token);
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              accessToken: user.access_token,
              idToken: user.id_token || null,
              user: {
                sub: user.profile?.sub,
                email: user.profile?.email,
                name: user.profile?.name,
                tenant: (user.profile as Record<string,unknown>)?.['sws.samauth.ten'] as string,
              },
              error: null,
            });
          } else {
            setAuthState(s => ({ ...s, isLoading: false }));
          }
        } else {
          // No OIDC config — fall back to mock
          setAuthToken(MOCK_USER.accessToken);
          setAuthState({ ...MOCK_USER });
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setAuthState(s => ({ ...s, isLoading: false, error: String(err) }));
      }
    }
    init();
  }, []);

  const login = useCallback(async () => {
    try {
      await signinRedirect();
    } catch (err) {
      console.error('Login error:', err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthToken(null);
      if (appConfig?.mockMode || !appConfig?.oidcIssuer) {
        setAuthState({ isAuthenticated: false, isLoading: false, accessToken: null, idToken: null, user: null, error: null });
        return;
      }
      await signoutRedirect();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [appConfig]);

  const handleCallback = useCallback(async () => {
    try {
      const user: User = await doSigninCallback();
      setAuthToken(user.access_token);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        accessToken: user.access_token,
        idToken: user.id_token || null,
        user: {
          sub: user.profile?.sub,
          email: user.profile?.email,
          name: user.profile?.name,
        },
        error: null,
      });
    } catch (err) {
      console.error('Callback error:', err);
      setAuthState(s => ({ ...s, isLoading: false, error: String(err) }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      config: appConfig,
      login,
      logout,
      handleCallback,
      isMockMode: appConfig?.mockMode ?? false,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}



