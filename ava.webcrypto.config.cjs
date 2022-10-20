const config = require('./ava.config.cjs')

config.environmentVariables.WEBCRYPTO = 'true'

module.exports = config
