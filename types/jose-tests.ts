import * as jose from './index.d';

jose.errors.JOSEError
jose.errors.JOSEAlgNotWhitelisted
jose.errors.JOSECritNotUnderstood
jose.errors.JOSEInvalidEncoding
jose.errors.JOSEMultiError
jose.errors.JOSENotSupported
jose.errors.JWEDecryptionFailed
jose.errors.JWEInvalid
jose.errors.JWKImportFailed
jose.errors.JWKInvalid
jose.errors.JWKKeySupport
jose.errors.JWKSNoMatchingKey
jose.errors.JWSInvalid
jose.errors.JWSVerificationFailed
jose.errors.JWTClaimInvalid
jose.errors.JWTExpired
jose.errors.JWTMalformed

jose.JWK.asKey('foo')
jose.JWK.asKey(Buffer.from('foo'))
jose.JWK.asKey({ kty: 'RSA', e: 'AQAB', n: 'foo' })
jose.JWK.asKey({ kty: 'RSA', e: 'AQAB', n: 'foo', use: 'enc' })
jose.JWK.asKey({ kty: 'RSA', e: 'AQAB', n: 'foo', use: 'sig' })
jose.JWK.asKey({ kty: 'RSA', e: 'AQAB', n: 'foo', key_ops: ['decrypt'] })
jose.JWK.asKey({ kty: 'RSA', e: 'AQAB', n: 'foo', kid: 'foo' })
jose.JWK.asKey({ kty: 'RSA', e: 'AQAB', n: 'foo' })
jose.JWK.asKey({ kty: 'oct', k: 'foo' })
jose.JWK.asKey({ kty: 'EC', crv: 'P-256', x: 'foo', y: 'foo' })
jose.JWK.asKey({ kty: 'EC', crv: 'P-256', x: 'foo', y: 'foo', d: 'foo' })
jose.JWK.asKey({ kty: 'OKP', crv: 'Ed25519', x: 'foo' })
const key = jose.JWK.asKey({ kty: 'OKP', crv: 'Ed25519', x: 'foo', d: 'foo' })

;(async () => {
  ;(await jose.JWK.generate('EC', 'P-256')).toJWK()
  ;(await jose.JWK.generate('OKP', 'X448', { kid: 'foo' })).toJWK()
  ;(await jose.JWK.generate('RSA', 2048)).toJWK()
  ;(await jose.JWK.generate('oct', 256)).toJWK()
})()

;(jose.JWK.generateSync('EC', 'P-256')).toJWK()
;(jose.JWK.generateSync('OKP', 'X448', { kid: 'foo' })).toJWK()
;(jose.JWK.generateSync('RSA', 2048)).toJWK()
;(jose.JWK.generateSync('oct', 256)).toJWK()

new jose.JWKS.KeyStore()
const keystore = new jose.JWKS.KeyStore([jose.JWK.generateSync('RSA')])

jose.JWS.sign({}, key)
jose.JWS.sign({}, jose.JWK.None)
jose.JWS.sign('foo', key)
jose.JWS.sign(Buffer.from('foo'), key)

{
  new jose.JWS.Sign('foo')
  new jose.JWS.Sign(Buffer.from('foo'))
  const sign = new jose.JWS.Sign({})

  sign.recipient(key, { alg: 'foo' }, { foo: 'bar' })
  sign.sign('compact').substring(0)
  {
    const { header, payload, protected: prot, signature } = sign.sign('flattened')
    if (typeof payload === 'string') {
      payload.substring(0)
    } else if (Buffer.isBuffer(payload)) {
      payload.byteOffset
    }
    signature.substring(0)
    if (header) Object.entries(header)
    if (prot) Object.entries(prot)
  }
  {
    const { payload, signatures } = sign.sign('general')
    if (typeof payload === 'string') {
      payload.substring(0)
    } else if (Buffer.isBuffer(payload)) {
      payload.byteOffset
    }
    signatures.forEach(({ header, protected: prot, signature }) => {
      signature.substring(0)
      if (header) Object.entries(header)
      if (prot) Object.entries(prot)
    })
  }

  jose.JWS.sign.flattened({}, key, { alg: 'foo' }, {})
  jose.JWS.sign.general({}, key, { alg: 'foo' }, {})
}

{
  jose.JWS.verify(jose.JWS.sign('', key), key)
  jose.JWS.verify(jose.JWS.sign.flattened('', key), key)
  jose.JWS.verify(jose.JWS.sign.general('', key), key)
  jose.JWS.verify('', keystore)
  jose.JWS.verify('', key, { algorithms: ['PS256'], crit: ['foo'] })
}

{
  const key = jose.JWK.generateSync('RSA')
  key.toJWK(true)
  key.toJWK(false)
  key.toJWK()

  key.toPEM()
  key.toPEM(true)
  key.toPEM(false)
  key.toPEM(true, { type: 'pkcs1', passphrase: 'foo', cipher: 'aes-256-cbc' })

  key.type === 'private'
  key.type === 'public'
  key.secret

  key.use
  jose.JWK.asKey(key.keyObject)
  key.kid
  key.thumbprint
}

// TODO: add more
