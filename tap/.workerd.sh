#!/bin/bash

WORKERD_BIN=${WORKERD_BIN:-"$(pwd)/tap/workerd/node_modules/.bin/workerd"}
WORKERD_MODULE=${WORKERD_MODULE:-"$(pwd)/tap/workerd/node_modules/workerd"}

COMPATIBILITY_DATE=$(WORKERD_MODULE="$WORKERD_MODULE" node -p "const d = require(process.env.WORKERD_MODULE).compatibilityDate, t = new Date().toISOString().slice(0,10); d > t ? t : d")
WORKERD_VERSION=$(WORKERD_MODULE="$WORKERD_MODULE" node -p "require(process.env.WORKERD_MODULE + '/package.json').version")

echo "Using workerd $WORKERD_VERSION, compatibility date $COMPATIBILITY_DATE"

# nodejs_compat is on by default from this compatibility date onwards, and
# specifying it explicitly from then on is an error
if [[ "$COMPATIBILITY_DATE" < "2026-08-04" ]]; then
  NO_COMPAT_FLAGS='[]'
  COMPAT_FLAGS='["nodejs_compat"]'
else
  NO_COMPAT_FLAGS='["no_nodejs_compat"]'
  COMPAT_FLAGS='[]'
fi

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
  "$WORKERD_BIN" test --verbose "$(pwd)/tap/.workerd.capnp"
  return $?
}

run_test "$NO_COMPAT_FLAGS"
NO_COMPAT=$?

run_test "$COMPAT_FLAGS"
COMPAT=$?

echo ""
echo "Workerd without nodejs_compat"
test $NO_COMPAT -eq 0 && echo "  passed" || echo "  failed"

echo ""
echo "Workerd with nodejs_compat"
test $COMPAT -eq 0 && echo "  passed" || echo "  failed"

test $NO_COMPAT -eq 0 && test $COMPAT -eq 0
