#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./update-token.sh <feedly_access_token>"
  exit 1
fi

API_ENDPOINT=$(grep -v '^#' frontend/.env | grep REACT_APP_API_ENDPOINT | cut -d '=' -f2)

echo "Updating FEEDLY_ACCESS_TOKEN via $API_ENDPOINT/updateEnv ..."
curl -s -X POST "$API_ENDPOINT/updateEnv" \
  -H "Content-Type: application/json" \
  -d "{\"input\": \"$1\"}" | python3 -m json.tool
