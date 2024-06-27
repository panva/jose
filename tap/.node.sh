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

node tap/run-node.mjs '#dist'
NODE_CRYPTO=$?

node -e 'process.exit(parseInt(process.versions.node, 10))' &> /dev/null
NODE_VERSION=$?

if [[ "$NODE_VERSION" -le 14 ]]; then
  exit $NODE_CRYPTO
fi

node tap/run-node.mjs '#dist/webapi'
WEB_CRYPTO_API=$?

node tap/run-node.mjs '#dist/node-crypto-with-cryptokey'
NODE_WITH_CRYPTOKEY=$?

node tap/run-node.mjs '#dist/webcrypto-with-keyobject'
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
