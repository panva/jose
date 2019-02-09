const { TODO } = require('../errors')

function detect (input) {
  if (typeof input === 'string') {
    return 'compact'
  }

  if ('recipients' in input && 'ciphertext' in input && Array.isArray(input.recipients)) {
    if (input.recipients.every(s => 'encrypted_key' in s)) {
      return 'general'
    }
    throw new TODO('invalid serialization')
  }

  return 'flattened'
}

module.exports = {
  detect
}
