echo "Using $(deno --version | head -1)"

deno run --allow-read --allow-net --import-map tap/import_map.json tap/run-deno.ts
