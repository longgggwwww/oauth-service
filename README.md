# Hướng Dẫn Sử Dụng OAuth Service

Dịch vụ này cung cấp API OAuth 2.0 để quản lý client, token và user. Hướng dẫn dưới đây tập trung vào các bước cơ bản: đăng ký client, lấy token từ client credentials, tạo user và đăng nhập.

**Giả định server chạy tại:** `http://localhost:3000` (thay đổi nếu cần). Tất cả endpoint có prefix `/v1`.

## 1. Đăng Ký Client

Tạo một client mới để sử dụng cho API calls.

**Request:**

```bash
curl -X POST http://localhost:3000/v1/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-test-client",
    "description": "Client for testing API"
  }'
```

**Response (ví dụ):**

```json
{
  "id": "client-id-here",
  "clientId": "generated-client-id",
  "clientSecret": "plain-secret-value",
  "name": "my-test-client",
  "createdAt": "2025-11-28T..."
}
```

Lưu `clientId` và `clientSecret` (secret chỉ trả về một lần).

## 2. Lấy OAuth Token (Client Credentials Grant)

Sử dụng client credentials để lấy access token.

**Request (dùng HTTP Basic Auth):**

```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -u "generated-client-id:plain-secret-value" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

**Response (ví dụ):**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refresh-token-here",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "read write"
}
```

Lưu `access_token` để sử dụng trong các request sau.

## 3. Tạo User (User Registration)

Sử dụng access token từ bước 2 để tạo user mới.

**Request:**

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "phoneNumber": "+84123456789",
    "fullName": "User Name",
    "givenName": "User",
    "familyName": "Name"
  }'
```

**Response:** Thành công (user được tạo, có thể cần verify email).

## 4. Đăng Nhập User (User Login)

Sau khi user tồn tại, đăng nhập để lấy token user.

**Request:**

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Response (ví dụ):**

```json
{
  "accessToken": "user-access-token-here",
  "refreshToken": "user-refresh-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "User Name"
  }
}
```

Sử dụng `accessToken` này để gọi các API yêu cầu xác thực user.

## Lưu Ý

- Đảm bảo server đang chạy (`npm run start:dev`).
- Nếu gặp lỗi, kiểm tra logs server.
- Token có thời hạn (15 phút cho access token).
- Để refresh token: gửi `POST /oauth/token` với `grant_type=refresh_token` và `refresh_token`.

## Danh Sách Endpoint Chính

Dưới đây là các endpoint chính trong hệ thống (dựa trên mã nguồn, tất cả có prefix `/v1`):

### Client Management
- `POST /v1/clients` — Đăng ký client mới
- `GET /v1/clients` — Liệt kê clients của user
- `GET /v1/clients/:id` — Lấy chi tiết client
- `PUT /v1/clients/:id` — Cập nhật client
- `DELETE /v1/clients/:id` — Xóa client

### OAuth
- `GET /v1/oauth/authorize` — Bắt đầu authorization flow
- `POST /v1/oauth/token` — Trao đổi token (client_credentials, refresh_token, authorization_code)
- `POST /v1/oauth/revoke` — Thu hồi token
- `GET /v1/oauth/userinfo` — Lấy thông tin user (yêu cầu Bearer token)
- `GET /v1/.well-known/openid-configuration` — Discovery metadata

### Auth (User)
- `POST /v1/auth/register` — Đăng ký user mới (yêu cầu client credentials token)
- `POST /v1/auth/login` — Đăng nhập user
- `GET /v1/auth/verify-email` — Xác thực email
- `POST /v1/auth/resend-verification` — Gửi lại email xác thực
- `POST /v1/auth/logout` — Đăng xuất

### User Management
- `GET /v1/users/me` — Lấy thông tin user hiện tại
- `PUT /v1/users/me` — Cập nhật profile user
- `GET /v1/users/:id` — Lấy thông tin user theo ID

### MFA
- `POST /v1/mfa/enable` — Bật MFA
- `POST /v1/mfa/verify` — Xác thực MFA
- `POST /v1/mfa/disable` — Tắt MFA
- Và các endpoint cho passkey registration/auth

Nếu cần thêm ví dụ hoặc script tự động, hãy cho biết!

