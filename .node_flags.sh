NODE_VERSION=$(node -v)
export NODE_OPTIONS='--no-warnings'

if [[ $NODE_VERSION == "v16."* ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto --experimental-fetch'
elif [[ "$NODE_VERSION" == "v18."* ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto'
fi
