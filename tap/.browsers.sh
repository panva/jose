#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --target=esnext \
  --outfile=tap/run-browser.js \
  tap/run-browser.ts

HOSTNAME="localhost"
SSL=""

: "${BROWSER:=chrome:headless}"

testcafe "$BROWSER" --skip-js-errors --ssl "$SSL" --hostname "$HOSTNAME" tap/.browser.ts
