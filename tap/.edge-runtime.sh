#!/bin/bash

RUNTIME_VERSION=$(npm ls --global --json | jq -r '.dependencies["edge-runtime"].version')

echo "Using edge-runtime $RUNTIME_VERSION"

./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --sourcemap \
  --bundle \
  --target=esnext \
  --outfile=tap/run-edge-runtime.js \
  tap/run-edge-runtime.ts

node --enable-source-maps tap/.edge-runtime.mjs
