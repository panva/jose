const base64url = require('../help/base64url')
const { detect: resolveSerialization } = require('./serializers')
const { JWSVerificationFailed, JWSInvalidHeader } = require('../errors')
const { check, verify } = require('../jwa')
const isDisjoint = require('../help/is_disjoint')

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

    const parsedProt = prot ? base64url.JSON.decode(prot) : {}
    if (!isDisjoint(parsedProt, header)) {
      throw new JWSInvalidHeader('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
    }

    alg = parsedProt.alg || header.alg

    check(key, 'verify', alg)

    if (!verify(alg, key, [prot, payload].join('.'), base64url.decodeToBuffer(signature))) {
      throw new JWSVerificationFailed()
    }

    return base64url.JSON.decode.try(payload)
  }

  // general serialization format
  const { signatures, ...root } = jws
  for (const recipient of signatures) {
    try {
      return jwsVerify('flattened', { ...root, ...recipient }, key)
    } catch (err) {
      continue
    }
  }

  throw new JWSVerificationFailed()
}

module.exports = jwsVerify.bind(undefined, undefined)
