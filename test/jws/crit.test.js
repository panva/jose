const test = require('ava')

const base64url = require('../../lib/help/base64url')
const { JWK: { generateSync }, JWS, errors } = require('../..')

const UNDEFINED = 'http://example.invalid/UNDEFINED'

test('crit must be understood', t => {
  const k = generateSync('oct')
  const jws = JWS.sign({}, k, { crit: [UNDEFINED], [UNDEFINED]: true })
  t.throws(() => {
    JWS.verify(jws, k)
  }, { instanceOf: errors.JOSECritNotUnderstood, code: 'ERR_JOSE_CRIT_NOT_UNDERSTOOD', message: `critical "${UNDEFINED}" is not understood` })
  JWS.verify(jws, k, { crit: [UNDEFINED] })
})

test('crit must be present', t => {
  const k = generateSync('oct')
  t.throws(() => {
    JWS.sign({}, k, { crit: [UNDEFINED] })
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: `critical parameter "${UNDEFINED}" is missing` })
  t.throws(() => {
    JWS.verify(
      `${base64url.JSON.encode({ alg: 'HS256', crit: [UNDEFINED] })}.${base64url.JSON.encode({})}.`,
      k,
      { crit: [UNDEFINED] }
    )
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: `critical parameter "${UNDEFINED}" is missing` })
})

test('crit must be integrity protected', t => {
  const k = generateSync('oct')
  t.throws(() => {
    JWS.sign.flattened({}, k, undefined, { crit: [UNDEFINED] })
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: '"crit" Header Parameter MUST be integrity protected when present' })
  const jws = JWS.sign.flattened({}, k)
  jws.header = { crit: [UNDEFINED] }
  t.throws(() => {
    JWS.verify(jws, k, { crit: [UNDEFINED] })
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: '"crit" Header Parameter MUST be integrity protected when present' })
})

test('crit must be an array of strings', t => {
  const k = generateSync('oct')
  ;[{}, new Object(), false, null, Infinity, 0, Buffer.from('foo'), '', []].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWS.sign({}, k, { crit: val })
    }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: '"crit" Header Parameter MUST be an array of non-empty strings when present' })
    t.throws(() => {
      JWS.sign({}, k, { crit: [val] })
    }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: '"crit" Header Parameter MUST be an array of non-empty strings when present' })
  })
})

test('crit option be an array of strings', t => {
  ;[{}, new Object(), false, null, Infinity, 0, '', Buffer.from('foo')].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWS.verify({
        header: { alg: 'HS256' },
        payload: 'foo',
        signature: 'bar'
      }, generateSync('oct'), { crit: val })
    }, { instanceOf: TypeError, message: '"crit" option must be an array of non-empty strings' })
    t.throws(() => {
      JWS.verify({
        header: { alg: 'HS256' },
        payload: 'foo',
        signature: 'bar'
      }, generateSync('oct'), { crit: [val] })
    }, { instanceOf: TypeError, message: '"crit" option must be an array of non-empty strings' })
  })
})

test('crit must not contain JWE/JWS/JWA defined header parameters', t => {
  const k = generateSync('oct')
  ;[
    'alg', 'jku', 'jwk', 'kid', 'x5u', 'x5c', 'x5t', 'x5t#S256', 'typ', 'cty',
    'crit', 'enc', 'zip', 'epk', 'apu', 'apv', 'iv', 'tag', 'p2s', 'p2c'
  ].forEach((crit) => {
    t.throws(() => {
      JWS.sign({}, k, { crit: [crit] })
    }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: `The critical list contains a non-extension Header Parameter ${crit}` })
  })
})
