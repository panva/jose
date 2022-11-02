#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --minify-syntax \
  --target=esnext \
  --outfile=tap/run-node.js \
  tap/run-node.ts

source .node_flags.sh
node tap/run-node.js
