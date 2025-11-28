# Hướng Dẫn Nhanh: Đăng Ký Client, Lấy OAuth Token, Tạo Tài Khoản và Đăng Nhập

- **Môi trường mặc định**: server chạy tại `http://localhost:3000` (thay đổi tùy cấu hình `main.ts` / env).

- **Tổng quan các endpoint chính**:
  - `POST /clients` — tạo đăng ký client (trả về `clientId` và `clientSecret`).
  - `POST /oauth/token` — trao đổi token (hỗ trợ `client_credentials`, `authorization_code`, `refresh_token`).
  - `POST /auth/register` — tạo người dùng mới (yêu cầu token kiểu `client_credentials`).
  - `POST /auth/login` — đăng nhập bằng email/password (trả về `accessToken` và `refreshToken`).
  - `GET /oauth/userinfo` — lấy thông tin user (yêu cầu `Authorization: Bearer <token>`).
  - `GET /.well-known/openid-configuration` — discovery metadata.

## 1) Đăng ký một client mới (Client Credentials)

Request:

```bash
curl -sS -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-test-client",
    "description": "Test client for API calls",
    "redirectUris": []
  }'
```

Response (ví dụ):

```json
{
  "id": "...",
  "clientId": "generated-client-id",
  "clientSecret": "plain-secret-value",
  "name": "my-test-client",
  "redirectUris": [],
  "createdAt": "..."
}
```

Ghi chú: `clientSecret` chỉ trả về một lần khi tạo client; lưu giữ cẩn thận.

## 2) Lấy OAuth token (Client Credentials Grant)

Bạn có thể dùng HTTP Basic auth (theo RFC6749) hoặc gửi `client_id`/`client_secret` trong body. Ví dụ dùng Basic auth:

```bash
curl -sS -X POST http://localhost:3000/oauth/token \
  -u "<clientId>:<clientSecret>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

Response (ví dụ):

```json
{
  "access_token": "eyJ...",
  "refresh_token": "rftkn...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "..."
}
```

Lưu `access_token` để gọi các endpoint bảo vệ.

## 3) Dùng token (client credentials) để tạo user (POST /auth/register)

`POST /auth/register` yêu cầu client credentials token (kiểu token chứa `type: 'client_credentials'`). Ví dụ:

```bash
curl -sS -X POST http://localhost:3000/auth/register \
  -H "Authorization: Bearer <ACCESS_TOKEN_FROM_STEP2>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePassword123",
    "phoneNumber": "+84123456789",
    "fullName": "Alice Example",
    "givenName": "Alice",
    "familyName": "Example"
  }'
```

Response: tạo user thành công (chi tiết trả về phụ thuộc vào handler). Sau khi đăng ký, user có thể cần xác thực email nếu hệ thống bật tính năng đó.

## 4) Đăng nhập bằng email/password (POST /auth/login)

Sau khi user tồn tại và (nếu cần) đã verify email, gọi `POST /auth/login` để lấy token người dùng:

```bash
curl -sS -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePassword123",
    "clientId": "optional-client-id-if-you-want",
    "clientSecret": "optional-client-secret"
  }'
```

Response (ví dụ):

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "rftkn...",
  "user": { "id": "...", "email": "alice@example.com", ... }
}
```

Sử dụng `accessToken` trả về để gọi các endpoint yêu cầu xác thực người dùng (ví dụ `GET /oauth/userinfo`).

## 5) Lấy thông tin user (GET /oauth/userinfo)

```bash
curl -sS http://localhost:3000/oauth/userinfo \
  -H "Authorization: Bearer <USER_ACCESS_TOKEN>"
```

Response: JSON userinfo (payload phụ thuộc vào token loại `user`).

---

Nếu cần, tôi có thể:
- Thêm ví dụ cho `authorization_code` flow (PKCE) và cách sử dụng `code_verifier`/`redirect_uri`.
- Viết script shell/Makefile để tự động tạo client và lấy token thử nghiệm.

Nếu muốn, tôi sẽ commit thêm ví dụ `curl` có `jq` để tiện thử nghiệm.
