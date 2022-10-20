const config = require('./ava.config.cjs')

config.environmentVariables.CRYPTOKEY = 'true'

module.exports = config
