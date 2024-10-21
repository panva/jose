#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --sourcemap \
  --bundle \
  --platform=node \
  --external:#dist \
  --target=esnext \
  --outfile=tap/run-node.mjs \
  tap/run-node.ts

source .node_flags.sh

node tap/run-node.mjs
WEB_CRYPTO_API=$?

node tap/run-node.mjs --keys='KeyObject'
WEB_CRYPTO_API_WITH_KEYOBJECT=$?

echo ""
echo "Node.js with CryptoKey inputs"
test $WEB_CRYPTO_API -eq 0 && echo "  passed" || echo "  failed"

echo ""
echo "Node.js with KeyObject inputs"
test $WEB_CRYPTO_API_WITH_KEYOBJECT -eq 0 && echo "  passed" || echo "  failed"

test $WEB_CRYPTO_API -eq 0 && test $WEB_CRYPTO_API_WITH_KEYOBJECT -eq 0
