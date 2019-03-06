const isDisjoint = require('../help/is_disjoint')
const base64url = require('../help/base64url')
let validateCrit = require('../help/validate_crit')
const { JWEInvalid, JOSENotSupported } = require('../errors')

validateCrit = validateCrit.bind(undefined, JWEInvalid)

module.exports = (prot, unprotected, recipients, checkAlgorithms, crit) => {
  if (typeof prot === 'string') {
    try {
      prot = base64url.JSON.decode(prot)
    } catch (err) {
      throw new JWEInvalid('could not parse JWE protected header')
    }
  }

  let alg = []
  const enc = new Set()
  if (!isDisjoint(prot, unprotected) || !recipients.every(({ header }) => {
    if (typeof header === 'object') {
      alg.push(header.alg)
      enc.add(header.enc)
    }
    const combined = { ...unprotected, ...header }
    validateCrit(prot, combined, crit)
    if ('zip' in combined) {
      throw new JWEInvalid('"zip" Header Parameter MUST be integrity protected')
    } else if (prot && 'zip' in prot && prot.zip !== 'DEF') {
      throw new JOSENotSupported('only "DEF" compression algorithm is supported')
    }
    return isDisjoint(header, prot) && isDisjoint(header, unprotected)
  })) {
    throw new JWEInvalid('JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint')
  }

  if (typeof prot === 'object') {
    alg.push(prot.alg)
    enc.add(prot.enc)
  }
  if (typeof unprotected === 'object') {
    alg.push(unprotected.alg)
    enc.add(unprotected.enc)
  }

  alg = alg.filter(Boolean)
  enc.delete(undefined)

  if (recipients.length !== 1) {
    if (alg.includes('dir') || alg.includes('ECDH-ES')) {
      throw new JWEInvalid('dir and ECDH-ES alg may only be used with a single recipient')
    }
  }

  if (checkAlgorithms) {
    if (alg.length !== recipients.length) {
      throw new JWEInvalid('missing Key Management algorithm')
    }
    if (enc.size === 0) {
      throw new JWEInvalid('missing Content Encryption algorithm')
    } else if (enc.size !== 1) {
      throw new JWEInvalid('there must only be one Content Encryption algorithm')
    }
  } else {
    if (enc.size > 1) {
      throw new JWEInvalid('there must only be one Content Encryption algorithm')
    }
  }

  return [...enc][0]
}
