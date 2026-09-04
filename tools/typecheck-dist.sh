#!/bin/bash
# Type-checks the EMITTED declarations in dist/types standalone - no src/ involved - under the
# module resolution modes and lib configurations consumers actually use. This catches a broken
# build:types rsync, a src/lib type leaking into the published surface, and any NEW dependency on
# an ambient global.
set -e

TSC="./node_modules/.bin/tsc"
BASE="--noEmit --ignoreConfig --strict --skipLibCheck false --target esnext"

node tools/check-declaration-entries.js

# Check every declaration entry point from jsr.json so each public subpath is covered independently.
ENTRIES=$(node -e "const jsr = require('./jsr.json'); for (const target of Object.values(jsr.exports)) console.log(target.replace(/^\.\/src\//, 'dist/types/').replace(/\.ts$/, '.d.ts'))")

for entry in $ENTRIES; do
  if [ ! -f "$entry" ]; then
    echo "$entry not found - run 'npm run build:types' first" >&2
    exit 1
  fi
done

run() {
  echo "  $*"
  # shellcheck disable=SC2086
  $TSC $BASE "$@" $ENTRIES
}

echo "module resolution modes"
run --module preserve --moduleResolution bundler --lib esnext,dom,dom.iterable
run --module node16 --moduleResolution node16 --lib esnext,dom,dom.iterable
run --module nodenext --moduleResolution nodenext --lib esnext,dom,dom.iterable
run --module commonjs --moduleResolution node10 --ignoreDeprecations 6.0 --lib esnext,dom,dom.iterable

echo "supported consumer lib configurations"
# Browser / bundler: DOM lib, no @types/node
run --module preserve --moduleResolution bundler --lib esnext,dom,dom.iterable --typeRoots /nonexistent
# Node: @types/node, no DOM lib
run --module nodenext --moduleResolution nodenext --lib esnext --types node

# Neither DOM lib nor @types/node. The published types are not expected to be self-contained here -
# createRemoteJWKSet genuinely needs fetch - but the set of ambient globals they depend on is a
# contract. Pin it exactly, so a new dependency surfaces here rather than in a user's build.
# Notably `crypto` must NOT appear: src/types.d.ts probes globalThis structurally so that CryptoKey
# degrades to a checked structural fallback instead of silently resolving to `any`.
echo "ambient globals depended on with a bare lib"
EXPECTED="AbortSignal Headers Response URL"
# shellcheck disable=SC2086
ACTUAL=$(
  $TSC $BASE --module preserve --moduleResolution bundler --lib esnext \
    --typeRoots /nonexistent $ENTRIES 2>&1 |
    sed -n "s/.*error TS2304: Cannot find name '\([A-Za-z0-9_]*\)'.*/\1/p" | sort -u | tr '\n' ' ' | xargs
)
if [ "$ACTUAL" != "$EXPECTED" ]; then
  echo "  FAIL: the ambient globals the published types depend on changed" >&2
  echo "    expected: $EXPECTED" >&2
  echo "    actual:   $ACTUAL" >&2
  exit 1
fi
echo "  $ACTUAL"

echo "OK"
