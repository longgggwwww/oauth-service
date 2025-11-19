# Kế hoạch và Backlog — Dự án OAuth2 Authentication Service

Tài liệu này tóm tắt backlog sản phẩm, các ticket theo epic, và kế hoạch sprint theo kế hoạch Scrum đề xuất. Mỗi ticket gồm: Title, Description, Priority, Story Points, Category và Checklist.

---

## Tổng quan

- Tổng story points dự kiến: 105
- Sprint độ dài: 2 tuần
- Khuyến nghị vận tốc mỗi developer: 8-12 story points / sprint

---

## Epics chính

- Epic 1: Authentication Core
- Epic 2: OAuth2 Provider
- Epic 3: Token Management
- Epic 4: Multi-Factor Authentication
- Epic 5: Security & Compliance
- Epic 6: Monitoring & Operations
- Testing
- Infrastructure

---

## Product Backlog Tickets

### Epic 1: Authentication Core

#### Ticket 1 — Project Setup & Configuration

- Title: Initialize NestJS Project with Clean Architecture
- Description: Khởi tạo project NestJS với cấu trúc clean architecture, cài đặt các phụ thuộc cơ bản và cấu hình môi trường phát triển.
- Priority: High
- Story Points: 5
- Category: Setup
- Checklist:
  - Initialize NestJS project
  - Install core dependencies (@nestjs/config, @nestjs/cqrs, class-validator)
  - Tạo folder structure (core, infrastructure, interfaces)
  - Cấu hình Prisma và kết nối database
  - Cấu hình biến môi trường
  - Tạo basic AppModule và bootstrap
  - Cấu hình ESLint, Prettier
  - Tạo Dockerfile và docker-compose (skeleton)

#### Ticket 2 — Database Schema & Prisma Setup

- Title: Implement Database Schema with Prisma ORM
- Description: Thiết kế và triển khai schema database bằng Prisma, tạo migration và seed data cho development.
- Priority: High
- Story Points: 8
- Category: Infrastructure
- Checklist:
  - Thiết kế Prisma schema theo ERD
  - Cấu hình database connection
  - Tạo initial migration
  - Tạo Prisma service/module
  - Generate Prisma client
  - Tạo seed script cho dev
  - Tạo health check cho DB
  - Định nghĩa indexing strategy cho các trường hay truy vấn

#### Ticket 3 — User Domain Entities & Value Objects

- Title: Implement Core User Domain Model
- Description: Tạo User entity, value objects (Email, Password, UserId), domain events và aggregate root.
- Priority: High
- Story Points: 8
- Category: Feature
- Checklist:
  - Tạo User entity với validation logic
  - Implement Email value object (validation)
  - Implement Password value object (hashing)
  - Tạo UserRegistered domain event
  - Thiết lập aggregate root cho User
  - Implement domain exceptions (UserAlreadyExists, InvalidCredentials)
  - Viết unit tests cho domain logic
  - Mapper domain <-> persistence

#### Ticket 4 — User Registration Flow

- Title: Implement User Registration API
- Description: Use case đăng ký người dùng (CQRS), endpoint REST, input validation và trả về response phù hợp.
- Priority: High
- Story Points: 8
- Category: Feature
- Checklist:
  - Tạo RegisterUserCommand và Handler
  - Implement UserRepository port và Prisma adapter
  - Tạo POST /auth/register endpoint
  - Implement request DTO + validation
  - Implement response DTO
  - Password strength validation
  - Email uniqueness check
  - Viết integration tests cho registration

#### Ticket 5 — User Authentication & JWT Tokens

- Title: Implement User Login and JWT Generation
- Description: Use case xác thực người dùng, tạo JWT token, cấu hình guards/strategies.
- Priority: High
- Story Points: 8
- Category: Feature
- Checklist:
  - Tạo AuthenticateCommand và Handler
  - Implement JWT token service (generate/verify)
  - Tạo POST /auth/login endpoint
  - Credential validation
  - Setup JWT strategy và AuthGuard
  - Tạo token response DTO (access + refresh)
  - Tạo skeleton cho token refresh
  - Viết integration tests cho authentication

### Epic 2: OAuth2 Provider

#### Ticket 6 — OAuth2 Client Management

- Title: Implement Client Registration and Management
- Description: Tạo Client entity và endpoint đăng ký client, sinh client_id và client_secret.
- Priority: High
- Story Points: 5
- Category: Feature
- Checklist:
  - Tạo Client domain entity
  - Implement ClientRepository (Prisma)
  - Tạo POST /oauth/register endpoint
  - Validate redirect URIs, scopes
  - Generate client_id và client_secret
  - Response DTO cho client credentials
  - Viết tests cho client registration

#### Ticket 7 — Authorization Endpoint Implementation

- Title: Implement /oauth/authorize Endpoint
- Description: Xử lý yêu cầu authorization, validate client và redirect_uri, sinh authorization code.
- Priority: High
- Story Points: 8
- Category: Feature
- Checklist:
  - Tạo AuthorizationCommand và Handler
  - Implement GET /oauth/authorize endpoint
  - Validate client_id và redirect_uri
  - Sinh authorization code với expiration
  - Hỗ trợ PKCE (code_challenge)
  - Tạo màn consent (response skeleton)
  - Handle OAuth2 errors (invalid_request, unauthorized_client)
  - Viết tests cho authorization flow

#### Ticket 8 — Token Endpoint Implementation

- Title: Implement /oauth/token Endpoint
- Description: Trao đổi authorization code lấy access + refresh tokens, hỗ trợ PKCE.
- Priority: High
- Story Points: 5
- Category: Feature
- Checklist:
  - Tạo TokenCommand và Handler
  - Implement POST /oauth/token endpoint
  - Validate authorization code và client credentials
  - Generate access_token + refresh_token
  - Support PKCE verification (code_verifier)
  - Implement token response tuân RFC 6749
  - Viết tests cho token exchange flow

#### Ticket 9 — Basic Security Implementation

- Title: Implement Core Security Features
- Description: Cấu hình security headers, CORS, rate limiting và input sanitization.
- Priority: Medium
- Story Points: 5
- Category: Infrastructure
- Checklist:
  - Cấu hình Helmet cho security headers
  - Setup CORS policy
  - Implement rate limiting per client/IP
  - Add request validation pipeline và sanitization
  - Create global exception filter
  - Setup basic security audit logging

### Epic 3: Token Management

#### Ticket 10 — Token Refresh Mechanism

- Title: Implement Token Refresh Flow
- Description: Endpoint refresh token, validate và rotate token nếu cần.
- Priority: High
- Story Points: 5
- Category: Feature
- Checklist:
  - Tạo RefreshTokenCommand và Handler
  - Implement POST /oauth/token (grant_type=refresh_token)
  - Validate refresh token và client
  - Generate new access + refresh tokens
  - Implement token rotation (optional)
  - Invalidate old refresh token nếu dùng rotation
  - Viết tests cho refresh flow

#### Ticket 11 — Token Revocation & Blacklist

- Title: Implement Token Revocation Endpoint
- Description: Endpoint cho revoke token và cơ chế blacklist (Redis hoặc DB).
- Priority: Medium
- Story Points: 3
- Category: Feature
- Checklist:
  - Tạo RevokeTokenCommand và Handler
  - Implement POST /oauth/revoke endpoint
  - Store revoked tokens (Redis or DB)
  - Implement token introspection endpoint (optional)
  - Viết tests cho revocation

#### Ticket 12 — Redis Integration for Caching

- Title: Setup Redis for Token Caching
- Description: Tích hợp Redis để lưu cache token, blacklist, và tăng hiệu năng.
- Priority: Medium
- Story Points: 5
- Category: Infrastructure
- Checklist:
  - Thêm Redis vào docker-compose
  - Tạo Redis configuration service/module
  - Implement CachedTokenRepository (adapter)
  - Health checks cho Redis
  - Viết tests cho Redis integration

#### Ticket 13 — Enhanced Error Handling

- Title: Implement Comprehensive Error Handling
- Description: Tạo lỗi tuân OAuth2, structured logging và error monitoring.
- Priority: Medium
- Story Points: 3
- Category: Infrastructure
- Checklist:
  - Tạo OAuth2 error response DTOs
  - Structured JSON logging
  - Custom exception filters
  - Integrate error tracking (Sentry / equivalent)
  - Viết tests cho error scenarios

### Epic 4: Multi-Factor Authentication

#### Ticket 14 — TOTP MFA Setup

- Title: Implement Time-based OTP (TOTP) Authentication
- Description: Dịch vụ TOTP, QR code, backup codes, endpoints enable/verify MFA.
- Priority: Medium
- Story Points: 8
- Category: Feature
- Checklist:
  - Tạo MfaDevice entity và repository
  - Implement TOTP service (generate/verify)
  - QR code generation for authenticator apps
  - GET /mfa/setup (generate secret + QR)
  - POST /mfa/enable (verify code)
  - Generate và lưu backup codes
  - Viết comprehensive MFA tests

#### Ticket 15 — MFA Authentication Flow

- Title: Extend Login Flow with MFA Support
- Description: Thay đổi luồng đăng nhập để yêu cầu TOTP nếu bật MFA.
- Priority: Medium
- Story Points: 5
- Category: Feature
- Checklist:
  - Extend AuthenticateCommand to support MFA
  - POST /auth/mfa-verify endpoint
  - Remember-device option (optional)
  - Update login response to indicate MFA required
  - Viết integration tests cho MFA flow

#### Ticket 16 — Security Hardening

- Title: Implement Advanced Security Measures
- Description: Account lockout, password policy, security monitoring.
- Priority: Medium
- Story Points: 5
- Category: Infrastructure
- Checklist:
  - Account lockout after failed attempts
  - Enforce password policies
  - Setup security event logging
  - Suspicious activity detection rules
  - Add security headers (CSP, HSTS)

### Epic 5: Security & Compliance

#### Ticket 17 — Audit Logging System

- Title: Implement Comprehensive Audit Logging
- Description: Lưu event quan trọng, cung cấp endpoint quản trị để truy vấn.
- Priority: Low
- Story Points: 5
- Category: Infrastructure
- Checklist:
  - Tạo AuditLog entity và repository
  - Implement audit event capture decorators/middleware
  - Create admin endpoints để truy vấn logs
  - Implement retention policy
  - Viết tests cho audit logging

### Epic 6: Monitoring & Operations

#### Ticket 18 — Health Checks and Metrics

- Title: Implement Health Checks and Metrics Endpoints
- Description: Health check DB/Redis và export metrics (Prometheus).
- Priority: Low
- Story Points: 5
- Category: DevOps
- Checklist:
  - Add /health endpoint (DB, Redis checks)
  - Add /metrics (Prometheus)
  - Integrate request duration and basic metrics
  - Setup dashboard (Grafana) guidance
  - Viết docs cho monitoring

#### Ticket 19 — Dockerize Application

- Title: Containerize Application with Docker
- Description: Tạo Dockerfile và docker-compose cho dev & prod.
- Priority: Medium
- Story Points: 3
- Category: DevOps
- Checklist:
  - Create multi-stage Dockerfile
  - Create docker-compose.yml (db, redis)
  - Configure env in docker-compose
  - Optimize image size
  - Document run & debug workflows

### Testing Tickets

#### Ticket 20 — Unit Test Coverage for Core Domain

- Title: Achieve 80% Unit Test Coverage for Core Domain
- Description: Viết unit tests cho domain entities, value objects, domain services.
- Priority: High
- Story Points: 5
- Category: Testing
- Checklist:
  - Setup Jest
  - Create test utilities and factories
  - Write tests for User entity, Client entity, Token value objects
  - Mock repositories for domain tests
  - Integrate coverage reporting

#### Ticket 21 — Integration Test Suite

- Title: Create Comprehensive Integration Tests
- Description: End-to-end tests cho các luồng API quan trọng (register, login, OAuth2 flows).
- Priority: High
- Story Points: 8
- Category: Testing
- Checklist:
  - Setup test database and fixtures
  - Implement integration tests cho register, login, authorize, token, refresh, revoke
  - Create MFA integration tests
  - Setup CI để chạy integration tests

---

## Sprint Planning (đề xuất)

### Sprint 1 (Weeks 1-2): Foundation & Basic Auth

- Ticket 1 (Setup) — 5
- Ticket 2 (Prisma) — 8
- Ticket 3 (User Domain) — 8
- Ticket 4 (User Registration) — 8
- Ticket 5 (Authentication) — 8
- Total Story Points: 37

NOTE: original summary used 29; điều chỉnh do chia nhỏ ticket Database/Setup.

### Sprint 2 (Weeks 3-4): OAuth2 Core

- Ticket 6 (Client Registration) — 5
- Ticket 7 (Authorization) — 8
- Ticket 8 (Token Endpoint) — 5
- Ticket 20 (Unit Test Coverage, phần) — 5
- Total Story Points: 23

### Sprint 3 (Weeks 5-6): Token Management & Security

- Ticket 10 (Token Refresh) — 5
- Ticket 11 (Token Revocation) — 3
- Ticket 9 (Basic Security) — 5
- Ticket 12 (Redis Setup) — 5
- Total Story Points: 18

### Sprint 4 (Weeks 7-8): Multi-Factor Authentication

- Ticket 14 (TOTP MFA) — 8
- Ticket 15 (MFA Flow) — 5
- Ticket 21 (Integration Tests, phần) — 8
- Total Story Points: 21

### Sprint 5 (Weeks 9-10): Advanced Features & Polish

- Ticket 17 (Audit Logging) — 5
- Ticket 18 (Health Checks & Metrics) — 5
- Ticket 19 (Dockerize) — 3
- Ticket 2 (DB optimization / indexing) — 3
- Remaining testing and bug fixes
- Total Story Points: 16

---

## Tổng hợp story points theo category

- Feature: 55
- Infrastructure: 21
- Setup: 8
- Testing: 16
- DevOps: 5

---

## Definition of Done (áp dụng cho mọi ticket)

- Code implemented and reviewed
- Unit tests written and passing
- Integration tests cho main flows
- Documentation updated
- API contracts validated
- Performance benchmarks (as needed)
- Security review completed
- Deployed to staging (if applicable)
- Product Owner acceptance

---

## Ghi chú

- Các story point là ước lượng ban đầu theo thang Fibonacci (1,2,3,5,8,13) và có thể điều chỉnh theo vận tốc team thực tế.
- Một số ticket có thể chia nhỏ hơn để phù hợp sprint và giảm rủi ro.
- Khuyến nghị: chuẩn hoá template ticket (title, description, acceptance criteria, checklist, estimates) để dễ theo dõi trong backlog management tool (Jira, GitHub Issues,...).
