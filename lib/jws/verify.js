const base64url = require('../help/base64url')
const { detect: resolveSerialization } = require('./serializers')
const { JWSVerificationFailed, JWSMissingAlg } = require('../errors')
const { verify } = require('../jwa')

const SINGLE_RECIPIENT = new Set(['compact', 'flattened'])

/*
 * @public
 */
// TODO: option to return everything not just the payload
// TODO: add kid magic
const jwsVerify = (serialization, jws, key) => {
  if (!serialization) {
    serialization = resolveSerialization(jws)
  }

  let prot // protected header
  let header // unprotected header
  let payload
  let signature
  let alg

  if (SINGLE_RECIPIENT.has(serialization)) {
    if (serialization === 'compact') { // compact serialization format
      ([prot, payload, signature] = jws.split('.'))
      // TODO: assert prot, payload, signature
    } else { // flattened serialization format
      ({ protected: prot, payload, signature, header } = jws)
    }

    // TODO: alg may also be unprotected but must it must be provided disjoint
    const { alg: protectedAlg } = prot ? base64url.JSON.decode(prot) : {}
    const { alg: unprotectedAlg } = header || {}

    if (!protectedAlg ^ !unprotectedAlg) {
      alg = unprotectedAlg || protectedAlg
    } else {
      throw new JWSMissingAlg('missing alg')
    }

    try {
      if (!verify(alg, key, [prot, payload].join('.'), base64url.decodeToBuffer(signature))) {
        throw new JWSVerificationFailed('verification failed')
      }
    } catch (err) {
      throw new JWSVerificationFailed('verification failed')
    }

    return base64url.JSON.decode.try(payload)
  }

  // general serialization format
  const { signatures, ...root } = jws

  // general serialization format
  for (const recipient of signatures) {
    try {
      return jwsVerify('flattened', { ...root, ...recipient }, key)
    } catch (err) {
      continue
    }
  }

  throw new JWSVerificationFailed('verification failed')
}

module.exports = jwsVerify.bind(undefined, undefined)
