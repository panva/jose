#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --external:electron \
  --external:#dist \
  --platform=node \
  --minify-syntax \
  --target=esnext \
  --outfile=tap/run-electron.js \
  tap/run-electron.ts

source .electron_flags.sh
electron tap/run-electron.js
