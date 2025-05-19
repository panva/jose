#!/bin/bash

echo "Using $(deno --version | head -1)"

deno run --allow-read --allow-net --allow-env --unstable-sloppy-imports tap/run-deno.ts
