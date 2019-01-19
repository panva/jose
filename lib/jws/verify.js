const base64url = require('../help/base64url')
const { detect: resolveSerialization } = require('./serializers')
const { JWSVerificationFailed } = require('../errors')
const { verify } = require('../jwa')

const SINGLE_RECIPIENT = new Set(['compact', 'flattened'])

/*
 * @public
 */
// TODO: option to return everything not just the payload
// TODO: add kid magic
module.exports = (jws, key) => {
  const serialization = resolveSerialization(jws)
  let prot
  let payload
  let signature

  if (SINGLE_RECIPIENT.has(serialization)) {
    if (serialization === 'compact') { // compact serialization format
      ([prot, payload, signature] = jws.split('.'))
    } else { // flattened serialization format
      ({ protected: prot, payload, signature } = jws)
    }

    // TODO: alg may also be unprotected but must it must be provided disjoint
    const { alg } = base64url.JSON.decode(prot)

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
  ({ payload } = jws)
  for ({ protected: prot, signature } of jws.signatures) {
    // TODO: alg may also be unprotected but must it must be provided disjoint
    const { alg } = base64url.JSON.decode(prot)

    if (
      !key.algorithms('verify').has(alg) ||
      !verify(alg, key, [prot, payload].join('.'), base64url.decodeToBuffer(signature))
    ) {
      continue
    }

    try {
      if (!verify(alg, key, [prot, payload].join('.'), base64url.decodeToBuffer(signature))) {
        continue
      }
    } catch (err) {
      continue
    }

    return base64url.JSON.decode.try(payload)
  }

  throw new JWSVerificationFailed('verification failed')
}
