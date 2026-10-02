#!/usr/bin/env bash
set -e
echo "=== Setu AI deploy ==="
command -v vercel >/dev/null 2>&1 || npm install -g vercel
URL=$(vercel --yes --prod 2>&1 | tee /tmp/v.log | grep -Eo 'https://[^ ]+vercel\.app' | tail -1)
[ -z "$URL" ] && URL=$(grep -Eo 'https://[^ ]+' /tmp/v.log | tail -1)
echo ""
echo "LIVE: $URL"
echo "Install as phone app: open $URL in Chrome/Safari → Install app / Add to Home Screen"
