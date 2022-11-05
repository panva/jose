electron -i <<< 'process.exit(parseInt(process.versions.node, 10))' &> /dev/null
NODE_VERSION=$?
export NODE_OPTIONS='--no-warnings'

if [[ $NODE_VERSION == 16 ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto --experimental-fetch'
elif [[ "$NODE_VERSION" == 18 ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto'
fi
