#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --target=esnext \
  --outfile=tap/run-workers.js \
  tap/run-workers.ts

./node_modules/.bin/workerd serve --verbose tap/.workers.capnp &
sleep 1
failed=$(curl -s http://localhost:8080 | jq '.failed')
kill $(ps aux | grep 'workerd' | grep -v 'grep' | awk '{print $2}')
test $failed -eq 0
