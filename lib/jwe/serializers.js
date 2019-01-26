const { TODO } = require('../errors')

function detect (input) {
  if (typeof input === 'string') {
    return 'compact'
  }

  if ('encrypted_key' in input) {
    return 'flattened'
  }

  if ('recipients' in input && 'ciphertext' in input && Array.isArray(input.recipients)) {
    if (input.signatures.every(s => 'encrypted_key' in s)) {
      return 'general'
    }
  }

  throw new TODO('invalid serialization')
}

module.exports = {
  detect
}
