#!/usr/bin/env bash
set -e
[ -f .vercel/project.json ] || vercel link --yes
gh secret set VERCEL_ORG_ID -b"$(node -p "require('./.vercel/project.json').orgId")"
gh secret set VERCEL_PROJECT_ID -b"$(node -p "require('./.vercel/project.json').projectId")"
read -p "Token from https://vercel.com/account/tokens: " T
gh secret set VERCEL_TOKEN -b"$T"
echo "Auto-deploy configured."
