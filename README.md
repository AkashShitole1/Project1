# 🛡️ FDS IAM Playground

An educational and testing application for understanding and validating **FDS IAM** concepts including OAuth Clients, OIDC Login, Access Tokens, JWT Claims, Roles, Scopes, Groups, Tech Users, Token Exchange, Identity Providers, Trust Service, and Subscription Tiers.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (React)                    │
│                                                       │
│  ┌─────────────┐    OIDC Auth Code + PKCE Flow       │
│  │  React SPA  │◄──────────────────────────────┐    │
│  │   (Vite)    │                               │    │
│  └──────┬──────┘                               │    │
│         │ REST API calls (/api/*)               │    │
└─────────┼───────────────────────────────────────┘    
          │                                            
          ▼                                            
┌─────────────────────┐     ┌──────────────────────┐  
│   Nginx Reverse     │     │   FDS IAM / OIDC     │  
│   Proxy (:80/443)   │     │   Provider           │  
└────────┬────────────┘     └──────────────────────┘  
         │                           ▲                 
    ┌────┴────┐                      │                 
    │         │                      │                 
    ▼         ▼                      │                 
┌────────┐ ┌─────────────────────────┤                
│Frontend│ │  Node.js Backend        │                
│(nginx) │ │  (Express + TypeScript) │                
└────────┘ │                         │                
           │  - /api/token/decode    │                
           │  - /api/userinfo        │                
           │  - /api/user/me         │                
           │  - /api/groups          │                
           │  - /api/roles           │                
           │  - /api/scopes          │                
           │  - /api/idp             │                
           │  - /api/tech-users      │                
           │  - /api/token/exchange  │                
           │  - /api/trust-service   │                
           │  - /api/subscriptions   │                
           │  - /api/oauth-client    │                
           └─────────────────────────┘                
```

---

## 🚀 Quick Start — Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Clone / Setup

```bash
cd D:\untitled
cp .env.example .env
# Edit .env with your OIDC settings (or leave MOCK_MODE=true)
```

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
# Backend runs at http://localhost:4000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🎭 Mock Mode

If FDS IAM is unavailable or you want to explore the UI without authentication, enable **Mock Mode**:

```env
MOCK_MODE=true
```

In mock mode, the application will:
- Show a pre-populated sample access token with realistic FDS IAM claims
- Display mock roles: `PlaygroundAdmin`, `PlaygroundUser`, `AssetReader`, `AssetWriter`
- Show mock groups categorized as Application / Tenant / User groups
- Display mock subscription tier: `Premium`
- Allow creating/deleting mock tech users
- Simulate token exchange with realistic claim diffs
- Show sample IDP configurations (WebKey, Azure AD, OIDC, SAML)

---

## 🐳 Docker Deployment

### 1. Build and run with Docker Compose

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env as needed

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services started:
| Service   | Port | Description              |
|-----------|------|--------------------------|
| nginx     | 80   | Reverse proxy (entry)    |
| frontend  | —    | React app (internal)     |
| backend   | —    | Express API (internal)   |

### 2. Access the application

Open **http://localhost** (port 80).

### 3. Production HTTPS

1. Place your TLS certificates in `./certs/`:
   - `fullchain.pem`
   - `privkey.pem`
2. Uncomment the HTTPS server block in `nginx.conf`
3. Update `OIDC_REDIRECT_URI` to use `https://`
4. Restart: `docker-compose restart nginx`

---

## 🔐 OIDC Configuration

### Required Environment Variables

| Variable           | Description                                      | Example                              |
|--------------------|--------------------------------------------------|--------------------------------------|
| `OIDC_ISSUER`      | OIDC issuer URL                                  | `https://iam.example.com/oauth`      |
| `OIDC_CLIENT_ID`   | OAuth2 Client ID                                 | `fds-iam-playground`                 |
| `OIDC_CLIENT_SECRET` | OAuth2 Client Secret                           | `secret123`                          |
| `OIDC_REDIRECT_URI` | Callback URL (must be registered in IAM)        | `http://localhost:3000/callback`     |
| `OIDC_SCOPES`      | Space-separated list of requested scopes         | `openid profile email`               |
| `IAM_BASE_URL`     | Base URL for IAM REST API                        | `https://iam.example.com`            |

### OAuth2 Client Requirements

Register an OAuth2 client in FDS IAM with:
- **Grant Types**: `authorization_code`, `refresh_token`
- **Redirect URI**: matches `OIDC_REDIRECT_URI`
- **Scopes**: `openid`, `profile`, `email`, plus any domain scopes
- **PKCE**: enabled (S256 code challenge method)
- **Token Endpoint Auth Method**: `client_secret_basic` or `none` (for public clients)

### Auth Flow

```
Browser                    Backend                    FDS IAM
   │                          │                          │
   │── Click Login ──────────►│                          │
   │                          │── OIDC Discovery ───────►│
   │◄── Redirect to IAM ──────│                          │
   │                          │                          │
   │────────────── Login at IAM ──────────────────────►  │
   │◄───────────── Auth Code Callback ──────────────── ──│
   │                          │                          │
   │── Callback /callback ───►│                          │
   │                          │── Exchange Code ────────►│
   │                          │◄── Tokens ───────────────│
   │◄── Session / Redirect ───│                          │
```

---

## 🔗 FDS IAM Integration

The backend integrates with these FDS IAM APIs:

| Backend Route            | IAM Endpoint           | Description                   |
|--------------------------|------------------------|-------------------------------|
| `GET /api/userinfo`      | `GET /userinfo`        | OIDC UserInfo endpoint        |
| `GET /api/user/me`       | `GET /Users/me`        | SCIM user profile             |
| `GET /api/groups`        | `GET /Groups`          | SCIM groups                   |
| `GET /api/idp`           | `GET /identity-providers` | IDP configurations         |
| `POST /api/tech-users`   | `POST /tech-users`     | Create service account        |
| `GET /api/tech-users`    | `GET /tech-users`      | List service accounts         |
| `DELETE /api/tech-users/:id` | `DELETE /tech-users/:id` | Remove service account  |
| `POST /api/token/exchange` | `POST /oauth/token`  | RFC 8693 Token Exchange       |
| `GET /api/trust-service` | `GET /trust-service`   | Trust service metadata        |

All API calls pass the user's `Bearer` access token in the `Authorization` header.

---

## 📄 Pages Reference

| Page               | Route              | Description                                      |
|--------------------|--------------------|--------------------------------------------------|
| Login              | `/login`           | OIDC login/logout and auth status                |
| Dashboard          | `/`                | Overview of user, token context, roles, tiers    |
| Token Viewer       | `/token`           | Decode and inspect access token JWT              |
| User Info          | `/user`            | User profile from `/Users/me`                    |
| Roles              | `/roles`           | Roles from `sws.samauth.role` claim              |
| Scopes             | `/scopes`          | OAuth scopes from `scope` claim                  |
| Groups             | `/groups`          | User groups categorized by type                  |
| OAuth Client       | `/oauth-client`    | Client configuration details                     |
| Identity Providers | `/idp`             | Configured IDPs (OIDC, SAML, etc.)               |
| Tech Users         | `/tech-users`      | Create/list/delete service accounts              |
| Token Exchange     | `/token-exchange`  | RFC 8693 cross-tenant token exchange             |
| Trust Explorer     | `/trust-explorer`  | Trust service groups and granted roles           |
| Subscription       | `/subscription`    | Subscription tiers from `sws.samauth.tiers`      |

---

## 🛠️ Development

### Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── middleware/      # Express middleware (auth, errors)
│   │   ├── routes/          # API route handlers
│   │   └── services/        # IAM service + mock data
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client, OIDC auth
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Router + providers
│   │   └── theme.ts         # MUI dark theme
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Container orchestration
├── nginx.conf               # Reverse proxy config
├── .env.example             # Environment template
└── README.md
```

### Backend API

All API routes accept an `Authorization: Bearer <access_token>` header.
When `MOCK_MODE=true`, real token and IAM calls are bypassed.

```bash
# Health check
curl http://localhost:4000/health

# Decode token
curl -X POST http://localhost:4000/api/token/decode \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJ..."}'

# Get user info (with token)
curl http://localhost:4000/api/userinfo \
  -H "Authorization: Bearer eyJ..."
```

### Adding New Features

1. Add a new route in `backend/src/routes/`
2. Register it in `backend/src/index.ts`
3. Add mock data in `backend/src/services/mockService.ts`
4. Add API call in `frontend/src/services/api.ts`
5. Create page in `frontend/src/pages/`
6. Register route in `frontend/src/App.tsx`
7. Add nav entry in `frontend/src/components/NavDrawer.tsx`

---

## 🔑 Key IAM Concepts Demonstrated

| Concept              | Where to See                          |
|----------------------|---------------------------------------|
| Access Token         | Token Viewer → Raw Token              |
| JWT Claims           | Token Viewer → Key Claims             |
| ID Token             | Dashboard (from OIDC profile)         |
| Roles                | Roles page (sws.samauth.role)         |
| Scopes               | Scopes page (scope claim)             |
| Tenant               | Dashboard (sws.samauth.ten)           |
| Groups               | Group Viewer (Application/Tenant/User)|
| Tech Users           | Tech Users page (client_credentials)  |
| Token Exchange       | Token Exchange page (RFC 8693)        |
| Identity Providers   | IDP Viewer (OIDC/SAML configs)        |
| Trust Service        | Trust Explorer (group → role mapping) |
| Subscription Tiers   | Subscription page (sws.samauth.tiers) |
| OAuth Client         | OAuth Client page (client_id, aud...) |

---

## 📝 License

This is an internal educational/testing tool. Not for production use without proper security review.

