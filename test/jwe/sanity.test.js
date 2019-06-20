const test = require('ava')

const base64url = require('../../lib/help/base64url')
const { JWKS, JWK: { generateSync }, JWE, errors } = require('../..')

test('algorithms option be an array of strings', t => {
  ;[{}, new Object(), false, null, Infinity, 0, '', Buffer.from('foo')].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWE.decrypt({
        header: { alg: 'HS256' },
        payload: 'foo',
        ciphertext: 'bar'
      }, generateSync('oct'), { algorithms: val })
    }, { instanceOf: TypeError, message: '"algorithms" option must be an array of non-empty strings' })
    t.throws(() => {
      JWE.decrypt({
        header: { alg: 'HS256' },
        payload: 'foo',
        ciphertext: 'bar'
      }, generateSync('oct'), { algorithms: [val] })
    }, { instanceOf: TypeError, message: '"algorithms" option must be an array of non-empty strings' })
  })
})

test('compact parts length check', t => {
  t.throws(() => {
    JWE.decrypt('', generateSync('oct'))
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
  t.throws(() => {
    JWE.decrypt('...', generateSync('oct'))
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
  t.throws(() => {
    JWE.decrypt('.....', generateSync('oct'))
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('verify key or store argument', t => {
  ;[{}, new Object(), false, null, Infinity, 0, Buffer.from('foo')].forEach((val) => { // eslint-disable-line no-new-object
    t.throws(() => {
      JWE.decrypt('....', val)
    }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.asKey or a JWKS.KeyStore' })
  })
})

test('JWE no alg specified but cannot resolve', t => {
  const k1 = generateSync('RSA', undefined, { alg: 'foo' })
  t.throws(() => {
    JWE.encrypt('foo', k1)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'could not resolve a usable "alg" for a recipient' })
})

test('JWE no alg/enc specified (multi recipient)', t => {
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(generateSync('RSA'))
  encrypt.recipient(generateSync('EC'))
  encrypt.recipient(generateSync('oct', 256))

  const jwe = encrypt.encrypt('general')
  t.is(jwe.unprotected, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { enc: 'A128CBC-HS256' })
  t.deepEqual(jwe.recipients[0].header, { alg: 'RSA-OAEP' })
  const { epk, ...rest } = jwe.recipients[1].header
  t.deepEqual(rest, { alg: 'ECDH-ES+A128KW' })
  t.deepEqual(jwe.recipients[2].header, { alg: 'A256KW' })
})

test('JWE no alg/enc specified (multi recipient) with per-recipient headers', t => {
  const encrypt = new JWE.Encrypt('foo')
  let k1 = generateSync('RSA', undefined, { kid: 'kid_1' })
  encrypt.recipient(k1, { kid: k1.kid })
  let k2 = generateSync('EC', undefined, { kid: 'kid_2' })
  encrypt.recipient(k2, { kid: k2.kid })
  let k3 = generateSync('oct', 256, { kid: 'kid_3' })
  encrypt.recipient(k3, { kid: k3.kid })

  const jwe = encrypt.encrypt('general')
  t.is(jwe.unprotected, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { enc: 'A128CBC-HS256' })
  t.deepEqual(jwe.recipients[0].header, { alg: 'RSA-OAEP', kid: 'kid_1' })
  const { epk, ...rest } = jwe.recipients[1].header
  t.deepEqual(rest, { alg: 'ECDH-ES+A128KW', kid: 'kid_2' })
  t.deepEqual(jwe.recipients[2].header, { alg: 'A256KW', kid: 'kid_3' })
})

test('JWE no alg/enc specified (single rsa), no protected header', t => {
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(generateSync('RSA'))

  const jwe = encrypt.encrypt('flattened')
  t.is(jwe.unprotected, undefined)
  t.is(jwe.header, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { alg: 'RSA-OAEP', enc: 'A128CBC-HS256' })
})

test('JWE no alg/enc specified (single rsa), with protected header', t => {
  const k = generateSync('RSA', undefined, { kid: 'jwk key id' })
  const encrypt = new JWE.Encrypt('foo', { kid: k.kid })
  encrypt.recipient(k)

  const jwe = encrypt.encrypt('flattened')
  t.is(jwe.unprotected, undefined)
  t.is(jwe.header, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { alg: 'RSA-OAEP', enc: 'A128CBC-HS256', kid: 'jwk key id' })
})

test('JWE no alg specified (single rsa), with protected header', t => {
  const k = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo', { enc: 'A256CBC-HS512' })
  encrypt.recipient(k)

  const jwe = encrypt.encrypt('flattened')
  t.is(jwe.unprotected, undefined)
  t.is(jwe.header, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { alg: 'RSA-OAEP', enc: 'A256CBC-HS512' })
})

test('JWE no alg specified (single rsa), with unprotected header', t => {
  const k = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo', undefined, { enc: 'A256CBC-HS512' })
  encrypt.recipient(k)

  const jwe = encrypt.encrypt('flattened')
  t.deepEqual(jwe.unprotected, { enc: 'A256CBC-HS512' })
  t.is(jwe.header, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { alg: 'RSA-OAEP' })
})

test('JWE no alg/enc specified (single oct)', t => {
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(generateSync('oct', 128))

  const jwe = encrypt.encrypt('flattened')
  t.is(jwe.unprotected, undefined)
  t.is(jwe.header, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { alg: 'A128KW', enc: 'A128CBC-HS256' })
})

test('JWE no alg/enc specified (single ec)', t => {
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(generateSync('EC'))

  const jwe = encrypt.encrypt('flattened')
  t.is(jwe.unprotected, undefined)
  t.is(jwe.header, undefined)
  const { epk, ...rest } = base64url.JSON.decode(jwe.protected)
  t.deepEqual(rest, { alg: 'ECDH-ES', enc: 'A128CBC-HS256' })
})

test('JWE no alg/enc specified (only on a key)', t => {
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(generateSync('RSA', undefined, { alg: 'RSA1_5', use: 'enc' }))

  const jwe = encrypt.encrypt('flattened')
  t.is(jwe.unprotected, undefined)
  t.is(jwe.header, undefined)
  t.deepEqual(base64url.JSON.decode(jwe.protected), { alg: 'RSA1_5', enc: 'A128CBC-HS256' })
})

test('aes_cbc_hmac_sha2 decrypt iv check (missing)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.iv
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_cbc_hmac_sha2 decrypt iv check (invalid length)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.iv = encrypted.iv.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid iv' })
})

test('aes_cbc_hmac_sha2 decrypt tag check (missing)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.tag
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_cbc_hmac_sha2 decrypt tag check (invalid length)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.tag = encrypted.tag.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid tag' })
})

test('aes_gcm decrypt iv check (missing)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.iv
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_gcm decrypt iv check (invalid length)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.iv = encrypted.iv.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid iv' })
})

test('aes_gcm decrypt tag check (missing)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.tag
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_gcm decrypt tag check (invalid length)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.tag = encrypted.tag.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid tag' })
})

test('JWE encrypt accepts buffer', t => {
  const k = generateSync('oct')
  JWE.encrypt(Buffer.from('foo'), k)
  t.pass()
})

test('JWE encrypt accepts string', t => {
  const k = generateSync('oct')
  JWE.encrypt('foo', k)
  t.pass()
})

test('JWE encrypt rejects other', t => {
  const k = generateSync('oct')
  ;[[], {}, false, true, undefined, null, Infinity, 0].forEach((val) => {
    t.throws(() => {
      JWE.encrypt(val, k)
    }, { instanceOf: TypeError, message: 'cleartext argument must be a Buffer or a string' })
  })
})

test('JWE encrypt protectedHeader rejects non objects if provided', t => {
  const k = generateSync('oct')
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWE.encrypt('foo', k, val)
    }, { instanceOf: TypeError, message: 'protectedHeader argument must be a plain object when provided' })
  })
})

test('JWE encrypt unprotectedHeader rejects non objects if provided', t => {
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      new JWE.Encrypt('foo', undefined, val) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: 'unprotectedHeader argument must be a plain object when provided' })
  })
})

test('JWE encrypt per-recipient header rejects non objects if provided', t => {
  const k = generateSync('oct')
  const enc = new JWE.Encrypt('foo')
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      enc.recipient(k, val)
    }, { instanceOf: TypeError, message: 'header argument must be a plain object when provided' })
  })
})

test('JWE encrypt aad rejects non buffers and non strings', t => {
  ;[[], false, true, null, Infinity, 0].forEach((val) => {
    t.throws(() => {
      new JWE.Encrypt('foo', undefined, undefined, val) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: 'aad argument must be a Buffer or a string when provided' })
  })
})

test('JWE encrypt rejects non keys', t => {
  ;[[], false, true, undefined, null, Infinity, 0].forEach((val) => {
    t.throws(() => {
      JWE.encrypt('foo', val)
    }, { instanceOf: TypeError, message: 'key must be an instance of a key instantiated by JWK.asKey' })
  })
})

test('JWE must have recipients', t => {
  const encrypt = new JWE.Encrypt('foo')
  t.throws(() => {
    encrypt.encrypt('compact')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing recipients' })
})

test('JWE valid serialization must be provided', t => {
  ;[[], false, true, null, Infinity, 0, 'foo', ''].forEach((val) => {
    const encrypt = new JWE.Encrypt('foo')
    t.throws(() => {
      encrypt.encrypt(val)
    }, { instanceOf: TypeError, message: 'serialization must be one of "compact", "flattened", "general"' })
  })
})

test('JWE compact does not support multiple recipients', t => {
  const k = generateSync('oct')
  const k2 = generateSync('EC')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k)
  encrypt.recipient(k2)
  t.throws(() => {
    encrypt.encrypt('compact')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE Compact Serialization doesn\'t support multiple recipients, JWE unprotected headers or AAD' })
})

test('JWE compact does not support unprotected header', t => {
  const k = generateSync('oct')
  t.throws(() => {
    JWE.encrypt('foo', k, undefined, { foo: 1 })
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE Compact Serialization doesn\'t support multiple recipients, JWE unprotected headers or AAD' })
})

test('JWE compact does not support aad', t => {
  const k = generateSync('oct')
  t.throws(() => {
    JWE.encrypt('foo', k, undefined, undefined, 'aad')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE Compact Serialization doesn\'t support multiple recipients, JWE unprotected headers or AAD' })
})

test('JWE flattened does not support multiple recipients', t => {
  const k = generateSync('oct')
  const k2 = generateSync('EC')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k)
  encrypt.recipient(k2)
  t.throws(() => {
    encrypt.encrypt('flattened')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'Flattened JWE JSON Serialization doesn\'t support multiple recipients' })
})

test('JWE must only have one Content Encryption algorithm (encrypt)', t => {
  const k = generateSync('oct')
  const k2 = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k, { enc: 'A128CBC-HS256' })
  encrypt.recipient(k2, { enc: 'A128GCM' })
  t.throws(() => {
    encrypt.encrypt('general')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'there must only be one Content Encryption algorithm' })
})

test('JWE must only have one Content Encryption algorithm (decrypt)', t => {
  const k = generateSync('oct')
  const k2 = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k, { enc: 'A128GCM' })
  encrypt.recipient(k2, { enc: 'A128GCM' })
  const jwe = encrypt.encrypt('general')
  t.throws(() => {
    jwe.recipients[0].header.enc = 'A128CBC-HS256'
    JWE.decrypt(jwe, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'there must only be one Content Encryption algorithm' })
})

test('JWE must have a Content Encryption algorithm (decrypt)', t => {
  const k = generateSync('oct')
  const k2 = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k, { enc: 'A128GCM' })
  encrypt.recipient(k2, { enc: 'A128GCM' })
  const jwe = encrypt.encrypt('general')
  t.throws(() => {
    delete jwe.recipients[0].header.enc
    delete jwe.recipients[1].header.enc
    JWE.decrypt(jwe, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing Content Encryption algorithm' })
})

test('JWE oct dir is only usable with a single recipient', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256', use: 'enc' })
  const k2 = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k, { alg: 'dir' })
  encrypt.recipient(k2)
  t.throws(() => {
    encrypt.encrypt('general')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'dir and ECDH-ES alg may only be used with a single recipient' })
})

test('JWE EC ECDH-ES is only usable with a single recipient', t => {
  const k = generateSync('EC', undefined, { alg: 'ECDH-ES', use: 'enc' })
  const k2 = generateSync('RSA')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k, { alg: 'ECDH-ES' })
  encrypt.recipient(k2)
  t.throws(() => {
    encrypt.encrypt('general')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'dir and ECDH-ES alg may only be used with a single recipient' })
})

test('JWE prot, unprot and per-recipient headers must be disjoint', t => {
  const k = generateSync('oct')
  t.throws(() => {
    const encrypt = new JWE.Encrypt('foo', { foo: 1 }, { foo: 2 })
    encrypt.recipient(k)
    encrypt.encrypt('flattened')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint' })
  t.throws(() => {
    const encrypt = new JWE.Encrypt('foo', { foo: 1 })
    encrypt.recipient(k, { foo: 2 })
    encrypt.encrypt('flattened')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint' })
  t.throws(() => {
    const encrypt = new JWE.Encrypt('foo', undefined, { foo: 1 })
    encrypt.recipient(k, { foo: 2 })
    encrypt.encrypt('flattened')
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE Shared Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint' })
})

test('JWE decrypt algorithms whitelist', t => {
  const k = generateSync('oct')
  const jwe = JWE.encrypt('foo', k, { alg: 'PBES2-HS256+A128KW' })
  JWE.decrypt(jwe, k, { algorithms: ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW'] })

  t.throws(() => {
    JWE.decrypt(jwe, k, { algorithms: ['PBES2-HS384+A192KW'] })
  }, { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' })
})

test('JWE decrypt algorithms whitelist with a keystore', t => {
  const k = generateSync('oct')
  const k2 = generateSync('oct')
  const ks = new JWKS.KeyStore(k, k2)

  const jwe = JWE.encrypt('foo', k2, { alg: 'PBES2-HS256+A128KW' })
  JWE.decrypt(jwe, ks, { algorithms: ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW'] })

  t.throws(() => {
    JWE.decrypt(jwe, ks, { algorithms: ['PBES2-HS384+A192KW'] })
  }, { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED' })
})

test('JWE decrypt algorithms whitelist with direct encryption', t => {
  const k = generateSync('oct')
  const jwe = JWE.encrypt('foo', k, { alg: 'dir' })
  JWE.decrypt(jwe, k, { algorithms: ['A128CBC-HS256'] })

  t.throws(() => {
    JWE.decrypt(jwe, k, { algorithms: ['PBES2-HS384+A192KW'] })
  }, { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED' })
})

test('JWE decrypt algorithms whitelist (multi-recipient)', t => {
  const k = generateSync('oct')
  const k2 = generateSync('RSA')

  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k)
  encrypt.recipient(k2)
  const jwe = encrypt.encrypt('general')

  JWE.decrypt(jwe, k, { algorithms: ['A256KW'] })
  JWE.decrypt(jwe, k2, { algorithms: ['RSA-OAEP'] })
  let err

  err = t.throws(() => {
    JWE.decrypt(jwe, k, { algorithms: ['RSA-OAEP'] })
  }, { instanceOf: errors.JOSEMultiError, code: 'ERR_JOSE_MULTIPLE_ERRORS' })
  ;[...err].forEach((e, i) => {
    if (i === 0) {
      t.is(e.constructor, errors.JOSEAlgNotWhitelisted)
    } else {
      t.is(e.constructor, errors.JWKKeySupport)
    }
  })

  err = t.throws(() => {
    JWE.decrypt(jwe, k2, { algorithms: ['A256KW'] })
  }, { instanceOf: errors.JOSEMultiError, code: 'ERR_JOSE_MULTIPLE_ERRORS' })
  ;[...err].forEach((e, i) => {
    if (i === 0) {
      t.is(e.constructor, errors.JWKKeySupport)
    } else {
      t.is(e.constructor, errors.JOSEAlgNotWhitelisted)
    }
  })
})

test('JWE "zip" must be integrity protected', t => {
  const k = generateSync('oct')

  t.throws(() => {
    JWE.encrypt.flattened('foo', k, undefined, { zip: 'DEF' })
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: '"zip" Header Parameter MUST be integrity protected' })
})

test('JWE "zip" only DEF is supported', t => {
  const k = generateSync('oct')

  t.throws(() => {
    JWE.encrypt.flattened('foo', k, { zip: 'FOO' })
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'only "DEF" compression algorithm is supported' })
})

test('JWE "zip" must be integrity protected (decrypt)', t => {
  const k = generateSync('oct')
  const jwe = JWE.encrypt.flattened('foo', k, { zip: 'DEF' })
  const prot = base64url.JSON.decode(jwe.protected)
  delete prot.zip
  jwe.protected = base64url.JSON.encode(prot)
  jwe.unprotected = { zip: 'DEF' }

  t.throws(() => {
    JWE.decrypt(jwe, k)
  }, { instanceOf: errors.JWEInvalid, code: 'ERR_JWE_INVALID', message: '"zip" Header Parameter MUST be integrity protected' })
})

test('JWE "zip" only DEF is supported (decrypt)', t => {
  const k = generateSync('oct')
  const jwe = JWE.encrypt.flattened('foo', k, { zip: 'DEF' })
  const prot = base64url.JSON.decode(jwe.protected)
  prot.zip = 'foo'
  jwe.protected = base64url.JSON.encode(prot)

  t.throws(() => {
    JWE.decrypt(jwe, k)
  }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'only "DEF" compression algorithm is supported' })
})

test('JWE keystore match multi but fails with decryption error', t => {
  const k = generateSync('oct')
  const ks = new JWKS.KeyStore(generateSync('oct'), generateSync('oct'))
  const jwe = JWE.encrypt('foo', k)

  t.throws(() => {
    JWE.decrypt(jwe, ks)
  }, { instanceOf: errors.JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})

test('JWE general fails with decryption error', t => {
  const k = generateSync('oct')
  const k2 = generateSync('oct')
  const k3 = generateSync('oct')
  const encrypt = new JWE.Encrypt('foo')
  encrypt.recipient(k)
  encrypt.recipient(k2)
  const jwe = encrypt.encrypt('general')

  t.throws(() => {
    JWE.decrypt(jwe, k3)
  }, { instanceOf: errors.JWEDecryptionFailed, code: 'ERR_JWE_DECRYPTION_FAILED' })
})
