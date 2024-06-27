#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --platform=node \
  --external:#dist \
  --external:#dist/webapi \
  --target=esnext \
  --outfile=tap/run-node.mjs \
  tap/run-node.ts

source .node_flags.sh

node tap/run-node.mjs --dist='#dist'
NODE_CRYPTO=$?

node tap/run-node.mjs --dist='#dist/webapi'
WEB_CRYPTO_API=$?

node tap/run-node.mjs --dist='#dist' --keys='#dist/webapi'
NODE_WITH_CRYPTOKEY=$?

node tap/run-node.mjs --dist='#dist/webapi' --keys='#dist'
WEB_CRYPTO_API_WITH_KEYOBJECT=$?

echo ""
echo "node:crypto"
test $NODE_CRYPTO -eq 0 && echo "  passed" || echo "  failed"

echo ""
echo "WebCryptoAPI"
test $WEB_CRYPTO_API -eq 0 && echo "  passed" || echo "  failed"

echo ""
echo "node:crypto with CryptoKey"
test $NODE_WITH_CRYPTOKEY -eq 0 && echo "  passed" || echo "  failed"

echo ""
echo "WebCryptoAPI with KeyObject"
test $WEB_CRYPTO_API_WITH_KEYOBJECT -eq 0 && echo "  passed" || echo "  failed"

test $WEB_CRYPTO_API -eq 0 && test $NODE_CRYPTO -eq 0 && test $WEB_CRYPTO_API_WITH_KEYOBJECT -eq 0 && test $NODE_WITH_CRYPTOKEY -eq 0
