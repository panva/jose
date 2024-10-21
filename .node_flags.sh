echo "Using Node.js $(node --version)"

node -e 'process.exit(parseInt(process.versions.node, 10))' &> /dev/null
NODE_VERSION=$?
export NODE_OPTIONS='--no-warnings --enable-source-maps'

if [[ $NODE_VERSION -eq 18 ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto'
fi
