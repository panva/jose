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
  --outfile=tap/run-workerd.js \
  tap/run-workerd.ts

cat <<EOT > $(pwd)/tap/.workerd.capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .tapWorker),
  ],
);

const tapWorker :Workerd.Worker = (
  modules = [
    (name = "worker", esModule = embed "run-workerd.js")
  ],
  compatibilityDate = "$COMPATIBILITY_DATE",
);
EOT

workerd test --verbose $(pwd)/tap/.workerd.capnp
