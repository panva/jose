#!/bin/bash

COMPATIBILITY_DATE=$(node -p "require('workerd').compatibilityDate")
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

generate_capnp() {
  local compatibility_flags=$1
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
  compatibilityFlags = $compatibility_flags
);
EOT
}

run_test() {
  local compatibility_flags=$1
  generate_capnp "$compatibility_flags"
  workerd test --verbose $(pwd)/tap/.workerd.capnp
  return $?
}

run_test "[]"
NO_COMPAT=$?

run_test '["nodejs_compat"]'
COMPAT=$?

echo ""
echo "Workerd without nodejs_compat"
test $NO_COMPAT -eq 0 && echo "  passed" || echo "  failed"

echo ""
echo "Workerd with nodejs_compat"
test $COMPAT -eq 0 && echo "  passed" || echo "  failed"

test $NO_COMPAT -eq 0 && test $COMPAT -eq 0
