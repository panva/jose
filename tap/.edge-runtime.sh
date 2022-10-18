./node_modules/.bin/esbuild --format=esm --bundle --target=esnext tap/run-edge-runtime.ts > tap/run-edge-runtime.js
node tap/.edge-runtime.mjs
