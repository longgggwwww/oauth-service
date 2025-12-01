// src/core/shared/utils/grant-type.utils.ts

/**
 * Converts internal grant type enum value to OAuth 2.0 RFC 6749 compliant format
 * Internal: CLIENT_CREDENTIALS, AUTHORIZATION_CODE, REFRESH_TOKEN, PASSWORD
 * OAuth 2.0: client_credentials, authorization_code, refresh_token, password
 */
export function toOAuth2GrantType(grantType: string): string {
  return grantType.toLowerCase();
}

/**
 * Converts OAuth 2.0 grant type to internal enum format
 * OAuth 2.0: client_credentials, authorization_code, refresh_token, password
 * Internal: CLIENT_CREDENTIALS, AUTHORIZATION_CODE, REFRESH_TOKEN, PASSWORD
 */
export function toInternalGrantType(grantType: string): string {
  return grantType.toUpperCase();
}

/**
 * Converts an array of internal grant types to OAuth 2.0 format
 */
export function toOAuth2GrantTypes(grantTypes: string[]): string[] {
  return grantTypes.map(toOAuth2GrantType);
}

/**
 * Converts an array of OAuth 2.0 grant types to internal format
 */
export function toInternalGrantTypes(grantTypes: string[]): string[] {
  return grantTypes.map(toInternalGrantType);
}
