echo "Using $(deno --version | head -1)"

export RUST_BACKTRACE=1

deno run --allow-read --allow-net --import-map tap/import_map.json --no-npm tap/run-deno.ts
