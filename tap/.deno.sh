echo "Using $(deno --version | head -1)"

export RUST_BACKTRACE=1

deno run --unstable-sloppy-imports --allow-read --allow-net --allow-env --no-npm tap/run-deno.ts
