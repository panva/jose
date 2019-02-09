const { createSecretKey } = require('crypto')

const generateCEK = require('./generate_cek')
const generateIV = require('../help/generate_iv')

const base64url = require('../help/base64url')
const { wrapKey, encrypt } = require('../jwa')
const OctKey = require('../jwk/key/oct')

const decrypt = require('./decrypt')

const shorthand = (serialization, payload, key, prot) => {
  const final = {}

  const { enc, alg } = prot

  let cek = generateCEK(enc)

  let wrapped
  let header
  let direct

  if (key.kty === 'oct' && alg === 'dir') {
    cek = new OctKey(key.keyObject, { use: 'enc', alg: enc })
    wrapped = ''
  } else {
    ({ wrapped, header, direct } = wrapKey(alg, key, cek.keyObject.export(), { enc, alg }))
    if (direct) {
      cek = new OctKey(createSecretKey(wrapped), { use: 'enc', alg: enc })
    }
  }

  // TODO: ecdh-es should not send encrypted_key
  final.encrypted_key = base64url.encode(wrapped)
  Object.assign(prot, header)

  const iv = generateIV(enc)

  final.iv = base64url.encode(iv)
  final.protected = base64url.JSON.encode(prot)

  const { ciphertext, tag } = encrypt(enc, cek, payload, { iv, aad: Buffer.from(final.protected) })
  final.tag = base64url.encode(tag)
  final.ciphertext = base64url.encode(ciphertext)

  return `${final.protected}.${final.encrypted_key}.${final.iv}.${final.ciphertext}.${final.tag}`
}

module.exports.encrypt = shorthand.bind(undefined, 'compact')
// module.exports.encrypt.flattened = shorthand.bind(undefined, 'flattened')
// module.exports.encrypt.general = shorthand.bind(undefined, 'general')

module.exports.decrypt = decrypt
