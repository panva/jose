const { randomBytes } = require('crypto')

const { createSecretKey } = require('../help/key_object')
const { KEYLENGTHS } = require('../registry')
const Key = require('../jwk/key/oct')

module.exports = (alg) => {
  const keyLength = KEYLENGTHS.get(alg)

  if (!keyLength) {
    return new Key({ type: 'secret' })
  }

  return new Key(createSecretKey(randomBytes(keyLength / 8)), { use: 'enc', alg })
}
