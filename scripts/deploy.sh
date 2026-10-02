#!/usr/bin/env bash
set -e
echo "=== Setu AI one-click deploy ==="
if ! command -v vercel >/dev/null 2>&1; then npm install -g vercel; fi
vercel --yes --prod
