const exit = () => process.exit(process.exitCode)
require('ava/lib/cli').run().then(exit, exit)
