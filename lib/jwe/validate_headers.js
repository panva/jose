const isDisjoint = require('../help/is_disjoint')
const base64url = require('../help/base64url')
const { JWEInvalidHeader } = require('../errors')

module.exports = (prot, unprotected, recipients) => {
  if (typeof prot === 'string') {
    prot = base64url.JSON.decode(prot)
  }

  const alg = new Set()
  const enc = new Set()
  if (!isDisjoint(prot, unprotected) || !recipients.every(({ header }) => {
    if (typeof header === 'object') {
      alg.add(header.alg)
      enc.add(header.enc)
    }
    return isDisjoint(header, prot) && isDisjoint(header, unprotected)
  })) {
    throw new JWEInvalidHeader('JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint')
  }

  if (typeof prot === 'object') {
    alg.add(prot.alg)
    enc.add(prot.enc)
  }
  if (typeof unprotected === 'object') {
    alg.add(unprotected.alg)
    enc.add(unprotected.enc)
  }

  alg.delete(undefined)
  enc.delete(undefined)

  if (enc.size !== 1) {
    throw new JWEInvalidHeader('TODO: there should be just one enc')
  }

  if (recipients.length !== 1) {
    if (alg.has('dir') || alg.has('ECDH-ES')) {
      throw new JWEInvalidHeader('dir and ECDH-ES alg may only be used with a single recipient')
    }
  }

  return [...enc][0]
}
