#!/bin/bash

LLRT_BIN=${LLRT_BIN:-llrt}

echo "Using $("$LLRT_BIN" --version)"

./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --target=esnext \
  --outfile=tap/run-llrt.js \
  tap/run-llrt.ts

"$LLRT_BIN" tap/run-llrt.js
