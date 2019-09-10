const { generateKeyPairSync } = require('crypto')

const { keyObjectSupported } = require('../../lib/help/runtime_support')
const { createPublicKey, createPrivateKey } = require('../../lib/help/key_object')

module.exports = {
  generateKeyPairSync (type, options) {
    if (keyObjectSupported) {
      return generateKeyPairSync(type, options)
    }

    const { privateKey, publicKey } = generateKeyPairSync(type, {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      ...options
    })

    return { privateKey: createPrivateKey(privateKey), publicKey: createPublicKey(publicKey) }
  }
}
