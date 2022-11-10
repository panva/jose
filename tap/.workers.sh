#!/bin/bash
./node_modules/.bin/esbuild \
  --log-level=warning \
  --format=esm \
  --bundle \
  --target=esnext \
  --outfile=tap/run-workers.js \
  tap/run-workers.ts

cat <<EOT > tap/.workers.capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .tapWorker),
  ],

  sockets = [
    # Serve HTTP on port 8080.
    ( name = "http",
      address = "*:8080",
      http = (),
      service = "main"
    ),
  ]
);

const tapWorker :Workerd.Worker = (
  modules = [
    (name = "worker", esModule = embed "run-workers.js")
  ],
  compatibilityDate = "$(node -p "require('workerd').compatibilityDate")",
);
EOT

./node_modules/.bin/workerd serve --verbose tap/.workers.capnp &
sleep 1
failed=$(curl -s http://localhost:8080 | jq '.failed')
kill $(ps aux | grep 'workerd' | grep -v 'grep' | awk '{print $2}')
test $failed -eq 0
