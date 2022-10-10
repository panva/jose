./node_modules/.bin/esbuild --format=esm --bundle --target=esnext tap/run-workers.ts > tap/run-workers.js
./node_modules/.bin/workerd serve --verbose tap/.workers.capnp &
sleep 1
failed=$(curl -s http://localhost:8080 | jq '.failed')
kill $(ps aux | grep 'workerd' | grep -v 'grep' | awk '{print $2}')
test $failed -eq 0
