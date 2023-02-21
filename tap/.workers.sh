#!/bin/bash

COMPATIBILITY_DATE=$(NODE_PATH=$(npm root -g) node -p "require('workerd').compatibilityDate")
WORKERD_VERSION=$(npm ls --global --json | jq -r '.dependencies.workerd.version')

echo "Using workerd $WORKERD_VERSION, compatibility date $COMPATIBILITY_DATE"

./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --define:WORKERD_VERSION=\"$WORKERD_VERSION\" \
  --target=esnext \
  --outfile=tap/run-workers.js \
  tap/run-workers.ts

cat <<EOT > $(pwd)/tap/.workers.capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .tapWorker),
  ],
);

const tapWorker :Workerd.Worker = (
  modules = [
    (name = "worker", esModule = embed "run-workers.js")
  ],
  compatibilityDate = "$COMPATIBILITY_DATE",
);
EOT

workerd test --verbose $(pwd)/tap/.workers.capnp
