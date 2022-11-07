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
else
  if [[ "$BROWSER" == "browserstack"* ]]; then
    if [[ "$BROWSER" != "browserstack:android"* ]]; then
      HOSTNAME="jose.panva.me"
      SSL="key=./letsencrypt/config/live/jose.panva.me/privkey.pem;cert=./letsencrypt/config/live/jose.panva.me/cert.pem;rejectUnauthorized=true;"
    fi
    BROWSER=$(node ./tap/browserstack.mjs $BROWSER)
  fi
fi

./node_modules/.bin/testcafe "$BROWSER" --skip-js-errors --ssl "$SSL" --hostname "$HOSTNAME" tap/.browser.ts
