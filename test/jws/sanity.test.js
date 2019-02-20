const test = require('ava')

const base64url = require('../../lib/help/base64url')
const { JWK: { generateSync }, JWS, errors: { JWSInvalid, JWSInvalidHeader, JWSNoRecipients } } = require('../..')

test('compact parts length check', t => {
  t.throws(() => {
    JWS.verify('', generateSync('oct'))
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
  t.throws(() => {
    JWS.verify('.', generateSync('oct'))
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
  t.throws(() => {
    JWS.verify('...', generateSync('oct'))
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
})

test('verify key or store argument', t => {
  ;[{}, new Object(), false, null, Infinity, 0, Buffer.from('foo')].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWS.verify('..', val)
    }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.importKey or a JWKS.KeyStore' })
  })
})

test('JWS sign accepts buffer', t => {
  const k = generateSync('oct')
  JWS.sign(Buffer.from('foo'), k)
  t.pass()
})

test('JWS sign accepts string', t => {
  const k = generateSync('oct')
  JWS.sign('foo', k)
  t.pass()
})

test('JWS sign accepts object', t => {
  const k = generateSync('oct')
  JWS.sign({}, k)
  t.pass()
})

test('JWS sign rejects other', t => {
  const k = generateSync('oct')
  ;[[], false, true, undefined, null, Infinity, 0].forEach((val) => {
    t.throws(() => {
      JWS.sign(val, k)
    }, { instanceOf: TypeError, message: 'payload argument must be a Buffer, string or an object' })
  })
})

test('JWS sign rejects non keys', t => {
  ;[[], false, true, undefined, null, Infinity, 0].forEach((val) => {
    t.throws(() => {
      JWS.sign('foo', val)
    }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.importKey' })
  })
})

test('JWS sign protectedHeader rejects non objects or undefined', t => {
  const k = generateSync('oct')
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWS.sign('foo', k, val)
    }, { instanceOf: TypeError, message: 'protectedHeader argument must be a plain object when provided' })
  })
})

test('JWS sign unprotectedHeader rejects non objects or undefined', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo')
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      sign.recipient(k, undefined, val)
    }, { instanceOf: TypeError, message: 'unprotectedHeader argument must be a plain object when provided' })
  })
})

test('JWS prot and unprot headers must be disjoint', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo')
  t.throws(() => {
    sign.recipient(k, { foo: 1 }, { foo: 0 })
  }, { instanceOf: JWSInvalidHeader, code: 'ERR_JWS_INVALID_HEADER', message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint' })
})

test('JWS must have recipients', t => {
  const sign = new JWS.Sign('foo')
  t.throws(() => {
    sign.sign('compact')
  }, { instanceOf: JWSNoRecipients, code: 'ERR_JWS_NO_RECIPIENTS', message: 'missing recipients' })
})

test('JWS valid serialization must be provided', t => {
  ;[[], false, true, null, Infinity, 0, 'foo', ''].forEach((val) => {
    const sign = new JWS.Sign('foo')
    t.throws(() => {
      sign.sign(val)
    }, { instanceOf: TypeError, message: 'serialization must be one of "compact", "flattened", "general"' })
  })
})

test('JWS compact does not support multiple recipients', t => {
  const k = generateSync('oct')
  const k2 = generateSync('ec')
  const sign = new JWS.Sign('foo')
  sign.recipient(k)
  sign.recipient(k2)
  t.throws(() => {
    sign.sign('compact')
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Compact Serialization doesn\'t support multiple recipients or JWS unprotected headers' })
})

test('JWS compact does not support unprotected header', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo')
  sign.recipient(k, undefined, { foo: 1 })
  t.throws(() => {
    sign.sign('compact')
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Compact Serialization doesn\'t support multiple recipients or JWS unprotected headers' })
})

test('JWS flattened does not support multiple recipients', t => {
  const k = generateSync('oct')
  const k2 = generateSync('ec')
  const sign = new JWS.Sign('foo')
  sign.recipient(k)
  sign.recipient(k2)
  t.throws(() => {
    sign.sign('flattened')
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'Flattened JWS JSON Serialization doesn\'t support multiple recipients' })
})

test('JWS no alg specified but cannot resolve', t => {
  const k1 = generateSync('rsa', undefined, { alg: 'foo' })
  t.throws(() => {
    JWS.sign({}, k1)
  }, { instanceOf: JWSInvalidHeader, code: 'ERR_JWS_INVALID_HEADER', message: 'could not resolve a usable "alg" for a recipient' })
})

test('JWS verify must be able to parse the protected header', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo').recipient(k)
  const jws = sign.sign('flattened')
  jws.protected = jws.protected.substr(1)
  t.throws(() => {
    JWS.verify(jws, k)
  }, { instanceOf: JWSInvalid, code: 'ERR_JWS_INVALID', message: 'could not parse JWS protected header' })
})

test('JWS verify must have disjoint header members', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo').recipient(k)
  const jws = sign.sign('flattened')
  jws.header = { alg: 'HS256' }
  t.throws(() => {
    JWS.verify(jws, k)
  }, { instanceOf: JWSInvalidHeader, code: 'ERR_JWS_INVALID_HEADER', message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint' })
})

test('JWS no alg specified (multi recipient)', t => {
  const sign = new JWS.Sign({})
  sign.recipient(generateSync('rsa'))
  sign.recipient(generateSync('ec'))
  sign.recipient(generateSync('oct', 256))

  const jws = sign.sign('general')
  t.deepEqual(base64url.JSON.decode(jws.signatures[0].protected), { alg: 'PS256' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[1].protected), { alg: 'ES256' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[2].protected), { alg: 'HS256' })
})

test('JWS no alg specified (multi recipient) with per-recipient protected headers', t => {
  const sign = new JWS.Sign({})
  let k1 = generateSync('rsa', undefined, { kid: 'kid_1' })
  sign.recipient(k1, { kid: k1.kid })
  let k2 = generateSync('ec', undefined, { kid: 'kid_2' })
  sign.recipient(k2, { kid: k2.kid })
  let k3 = generateSync('oct', undefined, { kid: 'kid_3' })
  sign.recipient(k3, { kid: k3.kid })

  const jws = sign.sign('general')
  t.deepEqual(base64url.JSON.decode(jws.signatures[0].protected), { alg: 'PS256', kid: 'kid_1' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[1].protected), { alg: 'ES256', kid: 'kid_2' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[2].protected), { alg: 'HS256', kid: 'kid_3' })
})
