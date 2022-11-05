#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --external:#dist \
  --external:#dist/webapi \
  --platform=node \
  --minify-syntax \
  --target=esnext \
  --outfile=tap/run-node.mjs \
  tap/run-node.ts

source .node_flags.sh

node tap/run-node.mjs '#dist'
NODE_CRYPTO_API=$?

node tap/run-node.mjs '#dist/webapi'
WEB_CRYPTO_API=$?

test $WEB_CRYPTO_API -eq 0 && test $NODE_CRYPTO_API -eq 0
