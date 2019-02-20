const test = require('ava')

const { sign, verify } = require('../../lib/jws')
const { JWK: { importKey, generateSync }, errors: { JWSVerificationFailed, JWSInvalid, JWSInvalidHeader } } = require('../..')

const PAYLOAD = {}

const fixtures = require('../fixtures')

const success = (t, sKey, vKey, alg) => {
  const signed = sign(PAYLOAD, sKey, { alg })
  t.truthy(signed)
  const verified = verify(signed, vKey)
  t.deepEqual(verified, {})
}

const failure = (t, sKey, vKey, alg) => {
  const signed = sign.flattened(PAYLOAD, sKey, { alg })
  t.truthy(signed)

  ;(() => {
    const orig = signed.protected

    if (signed.protected.startsWith('-')) {
      signed.protected = `Q${signed.protected.substr(1)}`
    } else {
      signed.protected = `-${signed.protected.substr(1)}`
    }
    t.throws(() => {
      verify(signed, vKey)
    }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'could not parse JWS protected header' })
    signed.protected = orig
  })()

  ;(() => {
    const orig = signed.protected
    delete signed.protected
    t.throws(() => {
      verify(signed, vKey)
    }, { instanceOf: JWSInvalidHeader, code: 'ERR_JWS_INVALID_HEADER', message: 'missing JWS signature algorithm' })
    signed.protected = orig
  })()

  ;(() => {
    const orig = signed.signature

    if (signed.signature.startsWith('-')) {
      signed.signature = `Q${signed.signature.substr(1)}`
    } else {
      signed.signature = `-${signed.signature.substr(1)}`
    }
    t.throws(() => {
      verify(signed, vKey)
    }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
    signed.signature = signed.signature.substr(4)
    t.throws(() => {
      verify(signed, vKey)
    }, { instanceOf: JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
    signed.signature = orig
  })()
}

Object.entries(fixtures.PEM).forEach(([type, { private: key, public: pub }]) => {
  const sKey = importKey(key)
  const vKey = importKey(pub)

  sKey.algorithms('sign').forEach((alg) => {
    test(`key ${type} > alg ${alg}`, success, sKey, vKey, alg)
    test(`key ${type} > alg ${alg} (negative cases)`, failure, sKey, vKey, alg)
  })
})

const sym = generateSync('oct')
sym.algorithms('sign').forEach((alg) => {
  test(`key ${sym.kty} > alg ${alg}`, success, sym, sym, alg)
  test(`key ${sym.kty} > alg ${alg} (negative cases)`, failure, sym, sym, alg)
})
