echo $(electron -i <<< 'process.exit(0)' 2> /dev/null | grep "Using" | awk '{$1=$1};1' | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]//g")

electron -i <<< 'process.exit(parseInt(process.versions.node, 10))' &> /dev/null
NODE_VERSION=$?
export NODE_OPTIONS='--no-warnings'

if [[ $NODE_VERSION -eq 18 ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto'
elif [[ $NODE_VERSION -eq 16 ]]; then
  export NODE_OPTIONS+=' --experimental-global-webcrypto --experimental-fetch'
fi
