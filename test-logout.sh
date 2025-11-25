#!/bin/bash

# Script to test logout functionality with proper debugging

echo "=== Testing Logout Endpoint ==="
echo ""

# Step 1: Get a valid access token first
echo "1. Getting access token via client credentials..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "test-client-id",
    "client_secret": "test-client-secret",
    "scope": "openid profile"
  }')

echo "Token response:"
echo "$TOKEN_RESPONSE" | jq '.' 2>/dev/null || echo "$TOKEN_RESPONSE"
echo ""

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to get access token. Please check:"
  echo "   - Server is running on port 3000"
  echo "   - Client credentials are correct"
  echo "   - Database has test client"
  exit 1
fi

echo "✅ Got access token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Step 2: Try logout
echo "2. Calling logout endpoint..."
LOGOUT_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:3000/v1/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_STATUS=$(echo "$LOGOUT_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$LOGOUT_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "HTTP Status: $HTTP_STATUS"
echo "Response body:"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

# Step 3: Check result
if [ "$HTTP_STATUS" == "204" ]; then
  echo "✅ Logout successful (HTTP 204)"
elif [ "$HTTP_STATUS" == "500" ]; then
  echo "❌ Internal Server Error (HTTP 500)"
  echo "Error details:"
  echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
  echo ""
  echo "Please check server logs for more details:"
  echo "  - Check for database connection errors"
  echo "  - Check for missing dependencies in auth module"
  echo "  - Look for stack traces in the console"
else
  echo "⚠️  Unexpected status: $HTTP_STATUS"
  echo "$RESPONSE_BODY"
fi
