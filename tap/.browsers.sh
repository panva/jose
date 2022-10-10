#!/bin/bash
npx esbuild --format=esm --bundle --target=esnext tap/run-browser.ts > tap/run-browser.js

if [[ -z $CI ]]; then
  BROWSER="chrome:headless"
  npx testcafe "$BROWSER" --skip-js-errors --hostname localhost tap/.browser.ts
else
  if [[ "$BROWSER" == "browserstack"* ]]; then
    BROWSER=$(node ./tap/browserstack.mjs $BROWSER)
    npx testcafe "$BROWSER" --skip-js-errors --ssl 'key=./letsencrypt/config/live/jose.panva.me/privkey.pem;cert=./letsencrypt/config/live/jose.panva.me/cert.pem;rejectUnauthorized=true;' --hostname 'jose.panva.me' tap/.browser.ts
  else
    xvfb-run --server-args="-screen 0 1280x720x24" npx testcafe "$BROWSER" --skip-js-errors --hostname localhost tap/.browser.ts
  fi
fi
