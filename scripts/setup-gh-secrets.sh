#!/usr/bin/env bash
set -e
[ -f .vercel/project.json ] || vercel link --yes
gh secret set VERCEL_ORG_ID -b"$(node -p "require('./.vercel/project.json').orgId")"
gh secret set VERCEL_PROJECT_ID -b"$(node -p "require('./.vercel/project.json').projectId")"
echo "Now add VERCEL_TOKEN at https://vercel.com/account/tokens, then: gh secret set VERCEL_TOKEN"
