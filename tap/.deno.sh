#!/bin/bash

echo "Using $(deno --version | head -1)"

export DENO_UNSTABLE_SLOPPY_IMPORTS=true

deno run --allow-read --allow-net --allow-env tap/run-deno.ts
