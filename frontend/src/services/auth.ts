import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';
import { AppConfig } from '../types';

let userManager: UserManager | null = null;

export function initOidc(config: AppConfig): UserManager {
  userManager = new UserManager({
    authority: config.oidcIssuer,
    client_id: config.oidcClientId,
    redirect_uri: config.oidcRedirectUri,
    response_type: 'code',
    scope: config.oidcScopes || 'openid profile email',
    post_logout_redirect_uri: window.location.origin,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    loadUserInfo: true,
  });
  return userManager;
}

export function getUserManager(): UserManager | null {
  return userManager;
}

export async function signinRedirect(): Promise<void> {
  if (!userManager) throw new Error('OIDC not initialized');
  await userManager.signinRedirect();
}

export async function signinCallback(): Promise<User> {
  if (!userManager) throw new Error('OIDC not initialized');
  return await userManager.signinRedirectCallback();
}

export async function signoutRedirect(): Promise<void> {
  if (!userManager) throw new Error('OIDC not initialized');
  await userManager.signoutRedirect();
}

export async function getUser(): Promise<User | null> {
  if (!userManager) return null;
  return await userManager.getUser();
}

export async function removeUser(): Promise<void> {
  if (!userManager) return;
  await userManager.removeUser();
}

