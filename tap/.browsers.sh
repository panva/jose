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

if [[ -z $CI ]]; then
  BROWSER="chrome:headless"
fi

testcafe "$BROWSER" --skip-js-errors --ssl "$SSL" --hostname "$HOSTNAME" tap/.browser.ts
