# Logout Feature Testing Guide

## Overview
The logout endpoint has been implemented to properly handle user logout by:
1. Revoking all refresh tokens for the user
2. Deleting auth sessions (if sessionId is provided)
3. Protecting the endpoint with JWT authentication

## Endpoint Details

**Endpoint**: `POST /v1/auth/logout`  
**Authentication**: Required (JWT Bearer token)  
**Response**: 204 No Content

## Testing Steps

### 1. Login to get access token

First, you need to login to get an access token:

```bash
# Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret"
  }'
```

This will return a response like:
```json
{
  "sessionId": "session-id-here",
  "mfaRequired": false
}
```

### 2. Exchange for OAuth token

Use the OAuth token endpoint to get access token:

```bash
# Get access token using authorization code or password grant
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "password",
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "username": "your-email@example.com",
    "password": "your-password",
    "scope": "openid profile email"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh-token-here",
  "scope": "openid profile email"
}
```

### 3. Call logout endpoint

Use the access token to logout:

```bash
# Logout (revokes all refresh tokens)
curl -X POST http://localhost:3000/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Expected response: **204 No Content** (empty response body)

### 4. Verify logout worked

Try to use the refresh token - it should fail:

```bash
# Try to refresh token (should fail)
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "refresh_token",
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

Expected: Error response indicating the refresh token is invalid or revoked.

## What Happens During Logout

1. **JWT Validation**: The JwtAuthGuard validates the access token
2. **User Extraction**: The userId is extracted from the JWT payload (`sub` claim)
3. **Revoke Refresh Tokens**: All refresh tokens for the user are marked as revoked in the database
4. **Delete Session**: If a sessionId was provided in the command, the auth session is deleted
5. **Response**: Returns 204 No Content on success

## Important Notes

- **Access Tokens**: Cannot be revoked (they are stateless JWTs). They will expire naturally based on their expiration time.
- **Refresh Tokens**: Are revoked immediately and cannot be used to get new access tokens.
- **Security**: For stricter security, consider implementing a token blacklist in Redis for access tokens.

## Error Scenarios

### 1. No Authorization Header
```bash
curl -X POST http://localhost:3000/v1/auth/logout
```
Response: 401 Unauthorized

### 2. Invalid Token
```bash
curl -X POST http://localhost:3000/v1/auth/logout \
  -H "Authorization: Bearer invalid-token"
```
Response: 401 Unauthorized

### 3. Expired Token
Response: 401 Unauthorized with message about token expiration

## Implementation Details

### Files Created/Modified:
1. **Created**: `src/core/application/use-cases/auth/commands/handlers/logout.handler.ts`
   - Implements the logout logic
   - Revokes refresh tokens
   - Deletes auth sessions

2. **Modified**: `src/interfaces/controllers/auth/auth.module.ts`
   - Registered LogoutHandler
   - Added RefreshTokenRepository and AuthSessionRepository dependencies

3. **Modified**: `src/interfaces/controllers/auth/auth.controller.ts`
   - Added JWT authentication guard to logout endpoint
   - Extract userId from JWT token instead of request body
