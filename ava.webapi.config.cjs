const config = require('./ava.config.cjs')

config.environmentVariables.WEBAPI = 'true'

if (process.version.startsWith('v16.')) {
  config.environmentVariables.NODE_OPTIONS = '--experimental-global-webcrypto --experimental-fetch'
} else if (process.version.startsWith('v18.')) {
  config.environmentVariables.NODE_OPTIONS = '--experimental-global-webcrypto'
}

module.exports = config
