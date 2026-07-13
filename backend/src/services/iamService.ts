import axios from 'axios';
import config from '../config';

const iamClient = axios.create({
  baseURL: config.iamBaseUrl,
  timeout: 10000,
});

export async function getUserInfo(accessToken: string) {
  const response = await iamClient.get('/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function getUserMe(accessToken: string) {
  const response = await iamClient.get('/Users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function getGroups(accessToken: string) {
  const response = await iamClient.get('/Groups', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function getIdps(accessToken: string) {
  const response = await iamClient.get('/identity-providers', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function exchangeToken(
  accessToken: string,
  subjectToken: string,
  providerTenant: string
) {
  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    subject_token: subjectToken,
    subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
    requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
    provider_tenant: providerTenant,
  });

  const response = await iamClient.post('/oauth/token', params.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

export async function createTechUser(accessToken: string, description: string) {
  const response = await iamClient.post(
    '/tech-users',
    { description },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
}

export async function listTechUsers(accessToken: string) {
  const response = await iamClient.get('/tech-users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function deleteTechUser(accessToken: string, clientId: string) {
  const response = await iamClient.delete(`/tech-users/${clientId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function getTrustService(accessToken: string) {
  const response = await iamClient.get('/trust-service', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

