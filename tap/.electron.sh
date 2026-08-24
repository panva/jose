#!/bin/bash

ELECTRON_BIN=${ELECTRON_BIN:-"$(pwd)/tap/electron/node_modules/.bin/electron"}
source .electron_flags.sh
"$ELECTRON_BIN" tap/run-electron.ts
