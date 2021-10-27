const { app } = require('electron')

const exit = () => app.exit(process.exitCode)
require('ava/lib/cli').run().then(exit, exit)
