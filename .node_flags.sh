echo "Using Node.js $(node --version)"

node -e 'process.exit(parseInt(process.versions.node, 10))' &> /dev/null
NODE_VERSION=$?
export NODE_OPTIONS='--enable-source-maps --import=ts-blank-space/register'
