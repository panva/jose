const base64url = require('./base64url')
const errors = require('../errors')
const asn1 = require('./asn1')

const EC_CURVES = new Set([
  'P-256',
  'P-256K',
  'P-384',
  'P-521'
])

const oidHexToCurve = new Map([
  ['06082a8648ce3d030107', 'P-256'],
  ['06052b8104000a', 'P-256K'],
  ['06052b81040022', 'P-384'],
  ['06052b81040023', 'P-521']
])
const EC_KEY_OID = '1.2.840.10045.2.1'.split('.')
const crvToOid = new Map([
  ['P-256', '1.2.840.10045.3.1.7'.split('.')],
  ['P-256K', '1.3.132.0.10'.split('.')],
  ['P-384', '1.3.132.0.34'.split('.')],
  ['P-521', '1.3.132.0.35'.split('.')]
])
const crvToOidBuf = new Map([
  ['P-256', Buffer.from('06082a8648ce3d030107', 'hex')],
  ['P-256K', Buffer.from('06052b8104000a', 'hex')],
  ['P-384', Buffer.from('06052b81040022', 'hex')],
  ['P-521', Buffer.from('06052b81040023', 'hex')]
])

const keyObjectToJWK = {
  rsa: {
    private (keyObject) {
      const der = keyObject.export({ type: 'pkcs8', format: 'der' })

      const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
      const RSAPrivateKey = asn1.get('RSAPrivateKey')

      const { privateKey } = PrivateKeyInfo.decode(der)
      const { n, e, d, p, q, dp, dq, qi } = RSAPrivateKey.decode(privateKey)

      return {
        kty: 'RSA',
        n: base64url.encodeBN(n),
        e: base64url.encodeBN(e),
        d: base64url.encodeBN(d),
        p: base64url.encodeBN(p),
        q: base64url.encodeBN(q),
        dp: base64url.encodeBN(dp),
        dq: base64url.encodeBN(dq),
        qi: base64url.encodeBN(qi)
      }
    },
    public (keyObject) {
      const der = keyObject.export({ type: 'spki', format: 'der' })

      const PublicKeyInfo = asn1.get('PublicKeyInfo')
      const RSAPublicKey = asn1.get('RSAPublicKey')

      const { publicKey: { data: publicKey } } = PublicKeyInfo.decode(der)
      const { n, e } = RSAPublicKey.decode(publicKey)

      return {
        kty: 'RSA',
        n: base64url.encodeBN(n),
        e: base64url.encodeBN(e)
      }
    }
  },
  ec: {
    private (keyObject) {
      // TODO: OID TO CURVE value check
      const der = keyObject.export({ type: 'pkcs8', format: 'der' })

      const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
      const ECPrivateKey = asn1.get('ECPrivateKey')

      const { privateKey, algorithm: { parameters: curveOid } } = PrivateKeyInfo.decode(der)
      const crv = oidHexToCurve.get(curveOid.toString('hex'))
      const { privateKey: d, publicKey: { data: publicKey } } = ECPrivateKey.decode(privateKey)

      const x = publicKey.slice(1, ((publicKey.length - 1) / 2) + 1)
      const y = publicKey.slice(((publicKey.length - 1) / 2) + 1)

      return {
        kty: 'EC',
        crv,
        d: base64url.encodeBuffer(d),
        x: base64url.encodeBuffer(x),
        y: base64url.encodeBuffer(y)
      }
    },
    public (keyObject) {
      const der = keyObject.export({ type: 'spki', format: 'der' })

      const PublicKeyInfo = asn1.get('PublicKeyInfo')

      const { publicKey: { data: publicKey }, algorithm: { parameters: curveOid } } = PublicKeyInfo.decode(der)
      const crv = oidHexToCurve.get(curveOid.toString('hex'))

      const x = publicKey.slice(1, ((publicKey.length - 1) / 2) + 1)
      const y = publicKey.slice(((publicKey.length - 1) / 2) + 1)

      return {
        kty: 'EC',
        crv,
        x: base64url.encodeBuffer(x),
        y: base64url.encodeBuffer(y)
      }
    }
  }
}

module.exports.keyObjectToJWK = (keyObject) => {
  if (keyObject.type === 'private') {
    return keyObjectToJWK[keyObject.asymmetricKeyType].private(keyObject)
  }

  return keyObjectToJWK[keyObject.asymmetricKeyType].public(keyObject)
}

const concatEcPublicKey = (x, y) => ({
  unused: 0,
  data: Buffer.concat([
    Buffer.alloc(1, 4),
    base64url.decodeToBuffer(x),
    base64url.decodeToBuffer(y)
  ])
})

const jwkToPem = {
  RSA: {
    private (jwk) {
      const RSAPrivateKey = asn1.get('RSAPrivateKey')

      return RSAPrivateKey.encode({
        version: 0,
        n: base64url.decodeToBuffer(jwk.n),
        e: base64url.decodeToBuffer(jwk.e),
        d: base64url.decodeToBuffer(jwk.d),
        p: base64url.decodeToBuffer(jwk.p),
        q: base64url.decodeToBuffer(jwk.q),
        dp: base64url.decodeToBuffer(jwk.dp),
        dq: base64url.decodeToBuffer(jwk.dq),
        qi: base64url.decodeToBuffer(jwk.qi)
      }, 'pem', { label: 'RSA PRIVATE KEY' }).toString('base64')
    },
    public (jwk) {
      const RSAPublicKey = asn1.get('RSAPublicKey')

      return RSAPublicKey.encode({
        version: 0,
        n: base64url.decodeToBuffer(jwk.n),
        e: base64url.decodeToBuffer(jwk.e)
      }, 'pem', { label: 'RSA PUBLIC KEY' }).toString('base64')
    }
  },
  EC: {
    private (jwk) {
      const ECPrivateKey = asn1.get('ECPrivateKey')

      return ECPrivateKey.encode({
        version: 0,
        privateKey: base64url.decodeToBuffer(jwk.d),
        parameters: {
          type: 'namedCurve',
          value: crvToOid.get(jwk.crv)
        },
        publicKey: concatEcPublicKey(jwk.x, jwk.y)
      }, 'pem', { label: 'EC PRIVATE KEY' }).toString('base64')
    },
    public (jwk) {
      const PublicKeyInfo = asn1.get('PublicKeyInfo')

      return PublicKeyInfo.encode({
        algorithm: {
          algorithm: EC_KEY_OID,
          parameters: crvToOidBuf.get(jwk.crv)
        },
        publicKey: concatEcPublicKey(jwk.x, jwk.y)
      }, 'pem', { label: 'PUBLIC KEY' }).toString('base64')
    }
  }
}

module.exports.jwkToPem = (jwk) => {
  switch (jwk.kty) {
    case 'EC':
      if (!EC_CURVES.has(jwk.crv)) {
        throw new errors.JOSENotSupported(`unsupported EC key curve: ${jwk.crv}`)
      }
      break
    case 'RSA':
      break
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${jwk.kty}`)
  }

  if (jwk.d) {
    return jwkToPem[jwk.kty].private(jwk)
  }

  return jwkToPem[jwk.kty].public(jwk)
}
