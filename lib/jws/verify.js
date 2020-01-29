const base64url = require('../help/base64url')
const isDisjoint = require('../help/is_disjoint')
let validateCrit = require('../help/validate_crit')
const getKey = require('../help/get_key')
const { KeyStore } = require('../jwks')
const errors = require('../errors')
const { check, verify } = require('../jwa')

const { detect: resolveSerialization } = require('./serializers')

validateCrit = validateCrit.bind(undefined, errors.JWSInvalid)
const SINGLE_RECIPIENT = new Set(['compact', 'flattened', 'preparsed'])

/*
 * @public
 */
const jwsVerify = (skipDisjointCheck, serialization, jws, key, { crit = [], complete = false, algorithms, parse = true, encoding = 'utf8' } = {}) => {
  key = getKey(key, true)

  if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some(s => typeof s !== 'string' || !s))) {
    throw new TypeError('"algorithms" option must be an array of non-empty strings')
  } else if (algorithms) {
    algorithms = new Set(algorithms)
  }

  if (!Array.isArray(crit) || crit.some(s => typeof s !== 'string' || !s)) {
    throw new TypeError('"crit" option must be an array of non-empty strings')
  }

  if (!serialization) {
    serialization = resolveSerialization(jws)
  }

  let prot // protected header
  let header // unprotected header
  let payload
  let signature
  let alg

  // treat general format with one recipient as flattened
  // skips iteration and avoids multi errors in this case
  if (serialization === 'general' && jws.signatures.length === 1) {
    serialization = 'flattened'
    const { signatures, ...root } = jws
    jws = { ...root, ...signatures[0] }
  }

  let decoded

  if (SINGLE_RECIPIENT.has(serialization)) {
    let parsedProt = {}

    switch (serialization) {
      case 'compact': // compact serialization format
        ([prot, payload, signature] = jws.split('.'))
        break
      case 'flattened': // flattened serialization format
        ({ protected: prot, payload, signature, header } = jws)
        break
      case 'preparsed': { // from the JWT module
        ({ decoded } = jws);
        ([prot, payload, signature] = jws.token.split('.'))
        break
      }
    }

    if (!header) {
      skipDisjointCheck = true
    }

    if (decoded) {
      parsedProt = decoded.header
    } else if (prot) {
      try {
        parsedProt = base64url.JSON.decode(prot)
      } catch (err) {
        throw new errors.JWSInvalid('could not parse JWS protected header')
      }
    } else {
      skipDisjointCheck = skipDisjointCheck || true
    }

    if (!skipDisjointCheck && !isDisjoint(parsedProt, header)) {
      throw new errors.JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint')
    }

    const combinedHeader = { ...parsedProt, ...header }
    validateCrit(parsedProt, header, crit)

    alg = parsedProt.alg || (header && header.alg)
    if (!alg) {
      throw new errors.JWSInvalid('missing JWS signature algorithm')
    } else if (algorithms && !algorithms.has(alg)) {
      throw new errors.JOSEAlgNotWhitelisted('alg not whitelisted')
    }

    if (key instanceof KeyStore) {
      const keystore = key
      const keys = keystore.all({ kid: combinedHeader.kid, alg: combinedHeader.alg, key_ops: ['verify'] })
      switch (keys.length) {
        case 0:
          throw new errors.JWKSNoMatchingKey()
        case 1:
          // treat the call as if a Key instance was passed in
          // skips iteration and avoids multi errors in this case
          key = keys[0]
          break
        default: {
          const errs = []
          for (const key of keys) {
            try {
              return jwsVerify(true, serialization, jws, key, { crit, complete, encoding, parse, algorithms: algorithms ? [...algorithms] : undefined })
            } catch (err) {
              errs.push(err)
              continue
            }
          }

          const multi = new errors.JOSEMultiError(errs)
          if ([...multi].some(e => e instanceof errors.JWSVerificationFailed)) {
            throw new errors.JWSVerificationFailed()
          }
          throw multi
        }
      }
    }

    check(key, 'verify', alg)

    const toBeVerified = Buffer.concat([
      Buffer.from(prot || ''),
      Buffer.from('.'),
      Buffer.isBuffer(payload) ? payload : Buffer.from(payload)
    ])

    if (!verify(alg, key, toBeVerified, base64url.decodeToBuffer(signature))) {
      throw new errors.JWSVerificationFailed()
    }

    if (!combinedHeader.crit || !combinedHeader.crit.includes('b64') || combinedHeader.b64) {
      if (parse) {
        payload = decoded ? decoded.payload : base64url.JSON.decode.try(payload, encoding)
      } else {
        payload = base64url.decodeToBuffer(payload)
      }
    }

    if (complete) {
      const result = { payload, key }
      if (prot) result.protected = parsedProt
      if (header) result.header = header
      return result
    }

    return payload
  }

  // general serialization format
  const { signatures, ...root } = jws
  const errs = []
  for (const recipient of signatures) {
    try {
      return jwsVerify(false, 'flattened', { ...root, ...recipient }, key, { crit, complete, encoding, parse, algorithms: algorithms ? [...algorithms] : undefined })
    } catch (err) {
      errs.push(err)
      continue
    }
  }

  const multi = new errors.JOSEMultiError(errs)
  if ([...multi].some(e => e instanceof errors.JWSVerificationFailed)) {
    throw new errors.JWSVerificationFailed()
  } else if ([...multi].every(e => e instanceof errors.JWKSNoMatchingKey)) {
    throw new errors.JWKSNoMatchingKey()
  }
  throw multi
}

module.exports = {
  bare: jwsVerify,
  verify: jwsVerify.bind(undefined, false, undefined)
}
