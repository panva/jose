#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --minify \
  --target=esnext \
  --outfile=tap/run-browser.js \
  tap/run-browser.ts

: "${BROWSER:=chromium}"

./node_modules/.bin/playwright test --project="$BROWSER"
