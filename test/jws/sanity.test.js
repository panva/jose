const test = require('ava')

const base64url = require('../../lib/help/base64url')
const { JWKS, JWK: { generateSync }, JWS, errors } = require('../..')

test('algorithms option be an array of strings', t => {
  ;[{}, new Object(), false, null, Infinity, 0, '', Buffer.from('foo')].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWS.verify({
        header: { alg: 'HS256' },
        payload: 'foo',
        signature: 'bar'
      }, generateSync('oct'), { algorithms: val })
    }, { instanceOf: TypeError, message: '"algorithms" option must be an array of non-empty strings' })
    t.throws(() => {
      JWS.verify({
        header: { alg: 'HS256' },
        payload: 'foo',
        signature: 'bar'
      }, generateSync('oct'), { algorithms: [val] })
    }, { instanceOf: TypeError, message: '"algorithms" option must be an array of non-empty strings' })
  })
})

test('compact parts length check', t => {
  t.throws(() => {
    JWS.verify('', generateSync('oct'))
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
  t.throws(() => {
    JWS.verify('.', generateSync('oct'))
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
  t.throws(() => {
    JWS.verify('...', generateSync('oct'))
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS malformed or invalid serialization' })
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
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint' })
})

test('JWS must have recipients', t => {
  const sign = new JWS.Sign('foo')
  t.throws(() => {
    sign.sign('compact')
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'missing recipients' })
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
  const k2 = generateSync('EC')
  const sign = new JWS.Sign('foo')
  sign.recipient(k)
  sign.recipient(k2)
  t.throws(() => {
    sign.sign('compact')
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Compact Serialization doesn\'t support multiple recipients or JWS unprotected headers' })
})

test('JWS compact does not support unprotected header', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo')
  sign.recipient(k, undefined, { foo: 1 })
  t.throws(() => {
    sign.sign('compact')
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Compact Serialization doesn\'t support multiple recipients or JWS unprotected headers' })
})

test('JWS flattened does not support multiple recipients', t => {
  const k = generateSync('oct')
  const k2 = generateSync('EC')
  const sign = new JWS.Sign('foo')
  sign.recipient(k)
  sign.recipient(k2)
  t.throws(() => {
    sign.sign('flattened')
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'Flattened JWS JSON Serialization doesn\'t support multiple recipients' })
})

test('JWS no alg specified but cannot resolve', t => {
  const k1 = generateSync('RSA', undefined, { alg: 'foo' })
  t.throws(() => {
    JWS.sign({}, k1)
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'could not resolve a usable "alg" for a recipient' })
})

test('JWS verify must be able to parse the protected header', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo').recipient(k)
  const jws = sign.sign('flattened')
  jws.protected = jws.protected.substr(4)
  t.throws(() => {
    JWS.verify(jws, k)
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'could not parse JWS protected header' })
})

test('JWS verify must have disjoint header members', t => {
  const k = generateSync('oct')
  const sign = new JWS.Sign('foo').recipient(k)
  const jws = sign.sign('flattened')
  jws.header = { alg: 'HS256' }
  t.throws(() => {
    JWS.verify(jws, k)
  }, { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Protected and JWS Unprotected Header Parameter names must be disjoint' })
})

test('JWS no alg specified (multi recipient)', t => {
  const sign = new JWS.Sign({})
  sign.recipient(generateSync('RSA'))
  sign.recipient(generateSync('EC'))
  sign.recipient(generateSync('oct', 256))

  const jws = sign.sign('general')
  t.deepEqual(base64url.JSON.decode(jws.signatures[0].protected), { alg: 'PS256' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[1].protected), { alg: 'ES256' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[2].protected), { alg: 'HS256' })
})

test('JWS no alg specified (multi recipient) with per-recipient protected headers', t => {
  const sign = new JWS.Sign({})
  const k1 = generateSync('RSA', undefined, { kid: 'kid_1' })
  sign.recipient(k1, { kid: k1.kid })
  const k2 = generateSync('EC', undefined, { kid: 'kid_2' })
  sign.recipient(k2, { kid: k2.kid })
  const k3 = generateSync('oct', undefined, { kid: 'kid_3' })
  sign.recipient(k3, { kid: k3.kid })

  const jws = sign.sign('general')
  t.deepEqual(base64url.JSON.decode(jws.signatures[0].protected), { alg: 'PS256', kid: 'kid_1' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[1].protected), { alg: 'ES256', kid: 'kid_2' })
  t.deepEqual(base64url.JSON.decode(jws.signatures[2].protected), { alg: 'HS256', kid: 'kid_3' })
})

test('JWS keystore match multi but fails with verification error', t => {
  const k = generateSync('oct')
  const ks = new JWKS.KeyStore(generateSync('oct'), generateSync('oct'))
  const jws = JWS.sign({}, k)

  t.throws(() => {
    JWS.verify(jws, ks)
  }, { instanceOf: errors.JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test('JWS general fails with decryption error', t => {
  const k = generateSync('oct')
  const k2 = generateSync('oct')
  const k3 = generateSync('oct')
  const sign = new JWS.Sign('foo')
  sign.recipient(k)
  sign.recipient(k2)
  const jws = sign.sign('general')

  t.throws(() => {
    JWS.verify(jws, k3)
  }, { instanceOf: errors.JWSVerificationFailed, code: 'ERR_JWS_VERIFICATION_FAILED' })
})

test('JWS verify algorithms whitelist', t => {
  const k = generateSync('oct')
  const jws = JWS.sign({}, k, { alg: 'HS512' })
  JWS.verify(jws, k, { algorithms: ['HS256', 'HS512'] })

  t.throws(() => {
    JWS.verify(jws, k, { algorithms: ['RS256'] })
  }, { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' })
})

test('JWS verify algorithms whitelist (with keystore)', t => {
  const k = generateSync('oct')
  const k2 = generateSync('oct')
  const ks = new JWKS.KeyStore(k, k2)

  const jws = JWS.sign({}, k2, { alg: 'HS512' })
  JWS.verify(jws, ks, { algorithms: ['HS256', 'HS512'] })

  t.throws(() => {
    JWS.verify(jws, ks, { algorithms: ['RS256'] })
  }, { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' })
})

test('JWS verify algorithms whitelist (multi-recipient)', t => {
  const k = generateSync('oct')
  const k2 = generateSync('RSA')

  const sign = new JWS.Sign({})
  sign.recipient(k)
  sign.recipient(k2)
  const jws = sign.sign('general')

  JWS.verify(jws, k, { algorithms: ['HS256', 'PS256'] })
  JWS.verify(jws, k2, { algorithms: ['HS256', 'PS256'] })

  let err

  err = t.throws(() => {
    JWS.verify(jws, k, { algorithms: ['RS256'] })
  }, { instanceOf: errors.JOSEMultiError, code: 'ERR_JOSE_MULTIPLE_ERRORS' })

  ;[...err].forEach((e, i) => {
    if (i === 0) {
      t.is(e.constructor, errors.JOSEAlgNotWhitelisted)
    } else {
      t.is(e.constructor, errors.JOSEAlgNotWhitelisted)
    }
  })
  err = t.throws(() => {
    JWS.verify(jws, k2, { algorithms: ['HS256'] })
  }, { instanceOf: errors.JOSEMultiError, code: 'ERR_JOSE_MULTIPLE_ERRORS' })
  ;[...err].forEach((e, i) => {
    if (i === 0) {
      t.is(e.constructor, errors.JWKKeySupport)
    } else {
      t.is(e.constructor, errors.JOSEAlgNotWhitelisted)
    }
  })
})

test('invalid tokens', t => {
  t.throws(() => {
    JWS.verify(
      'eyJ0eXAiOiJKV1QiLCJraWQiOiIyZTFkYjRmMC1mYmY5LTQxZjYtOGMxYi1hMzczYjgwZmNhYTEiLCJhbGciOiJFUzI1NiIsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHktc3RhZ2luZy5kZWxpdmVyb28uY29tLyIsImNsaWVudCI6ImIyM2I0ZjM1YzIyMTI5NDQxZjMwZDMyYmI5ZmM4ZWYyIiwic2lnbmVyIjoiYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzpldS13ZXN0LTE6NTE3OTAyNjYzOTE1OmxvYWRiYWxhbmNlci9hcHAvcGF5bWVudHMtZGFzaGJvYXJkLXdlYi80YzA4ZGI2NDMyMDIyOWEyIiwiZXhwIjoxNTYyNjkxNTg1fQ==.eyJlbWFpbCI6ImpvYW8udmllaXJhQGRlbGl2ZXJvby5jby51ayIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmYW1pbHlfbmFtZSI6Ikd1ZXJyYSBWaWVpcmEiLCJnaXZlbl9uYW1lIjoiSm9hbyIsIm5hbWUiOiJKb2FvIEd1ZXJyYSBWaWVpcmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1sTUpXTXV3R1dpYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFCVS9lNGtkTDg5UjlqZy9zOTYtYy9waG90by5qcGciLCJzdWIiOiIxMWE1YmFmMGRjNzcwNWRmMzk1ZTMzYWFkZjU2MDk4OCIsImV4cCI6MTU2MjY5MTU4NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1zdGFnaW5nLmRlbGl2ZXJvby5jb20vIn0=.DSHLJXLOfLJ-ZYcX0Vlii6Ak_jcDSkKOvNRj_rvtAyY9uYXtwo798ZrR35fgut-LuCdx0aKz2SgK0KJqw5q6dA==',
      generateSync('EC')
    )
  }, { instanceOf: errors.JOSEInvalidEncoding, code: 'ERR_JOSE_INVALID_ENCODING', message: 'input is not a valid base64url encoded string' })
})
