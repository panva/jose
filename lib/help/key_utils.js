const { EOL } = require('os')

const errors = require('../errors')

const { keyObjectSupported } = require('./runtime_support')
const { createPublicKey } = require('./key_object')
const base64url = require('./base64url')
const asn1 = require('./asn1')
const computePrimes = require('./rsa_primes')
const { OKP_CURVES, EC_CURVES } = require('../registry')

const formatPem = (base64pem, descriptor) => `-----BEGIN ${descriptor} KEY-----${EOL}${(base64pem.match(/.{1,64}/g) || []).join(EOL)}${EOL}-----END ${descriptor} KEY-----`

const okpToJWK = {
  private (crv, keyObject) {
    const der = keyObject.export({ type: 'pkcs8', format: 'der' })
    const OneAsymmetricKey = asn1.get('OneAsymmetricKey')
    const { privateKey: { privateKey: d } } = OneAsymmetricKey.decode(der)

    return {
      ...okpToJWK.public(crv, createPublicKey(keyObject)),
      d: base64url.encodeBuffer(d)
    }
  },
  public (crv, keyObject) {
    const der = keyObject.export({ type: 'spki', format: 'der' })

    const PublicKeyInfo = asn1.get('PublicKeyInfo')

    const { publicKey: { data: x } } = PublicKeyInfo.decode(der)

    return {
      kty: 'OKP',
      crv,
      x: base64url.encodeBuffer(x)
    }
  }
}

const keyObjectToJWK = {
  rsa: {
    private (keyObject) {
      const der = keyObject.export({ type: 'pkcs8', format: 'der' })

      const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
      const RSAPrivateKey = asn1.get('RSAPrivateKey')

      const { privateKey } = PrivateKeyInfo.decode(der)
      const { version, n, e, d, p, q, dp, dq, qi } = RSAPrivateKey.decode(privateKey)

      if (version !== 'two-prime') {
        throw new errors.JOSENotSupported('Private RSA keys with more than two primes are not supported')
      }

      return {
        kty: 'RSA',
        n: base64url.encodeBigInt(n),
        e: base64url.encodeBigInt(e),
        d: base64url.encodeBigInt(d),
        p: base64url.encodeBigInt(p),
        q: base64url.encodeBigInt(q),
        dp: base64url.encodeBigInt(dp),
        dq: base64url.encodeBigInt(dq),
        qi: base64url.encodeBigInt(qi)
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
        n: base64url.encodeBigInt(n),
        e: base64url.encodeBigInt(e)
      }
    }
  },
  ec: {
    private (keyObject) {
      const der = keyObject.export({ type: 'pkcs8', format: 'der' })

      const PrivateKeyInfo = asn1.get('PrivateKeyInfo')
      const ECPrivateKey = asn1.get('ECPrivateKey')

      const { privateKey, algorithm: { parameters: { value: crv } } } = PrivateKeyInfo.decode(der)
      const { privateKey: d, publicKey } = ECPrivateKey.decode(privateKey)

      if (typeof publicKey === 'undefined') {
        if (keyObjectSupported) {
          return {
            ...keyObjectToJWK.ec.public(createPublicKey(keyObject)),
            d: base64url.encodeBuffer(d)
          }
        }

        throw new errors.JOSENotSupported('Private EC keys without the public key embedded are not supported in your Node.js runtime version')
      }

      const x = publicKey.data.slice(1, ((publicKey.data.length - 1) / 2) + 1)
      const y = publicKey.data.slice(((publicKey.data.length - 1) / 2) + 1)

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

      const { publicKey: { data: publicKey }, algorithm: { parameters: { value: crv } } } = PublicKeyInfo.decode(der)

      const x = publicKey.slice(1, ((publicKey.length - 1) / 2) + 1)
      const y = publicKey.slice(((publicKey.length - 1) / 2) + 1)

      return {
        kty: 'EC',
        crv,
        x: base64url.encodeBuffer(x),
        y: base64url.encodeBuffer(y)
      }
    }
  },
  ed25519: {
    private (keyObject) {
      return okpToJWK.private('Ed25519', keyObject)
    },
    public (keyObject) {
      return okpToJWK.public('Ed25519', keyObject)
    }
  },
  ed448: {
    private (keyObject) {
      return okpToJWK.private('Ed448', keyObject)
    },
    public (keyObject) {
      return okpToJWK.public('Ed448', keyObject)
    }
  },
  x25519: {
    private (keyObject) {
      return okpToJWK.private('X25519', keyObject)
    },
    public (keyObject) {
      return okpToJWK.public('X25519', keyObject)
    }
  },
  x448: {
    private (keyObject) {
      return okpToJWK.private('X448', keyObject)
    },
    public (keyObject) {
      return okpToJWK.public('X448', keyObject)
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
    private (jwk, { calculateMissingRSAPrimes }) {
      const RSAPrivateKey = asn1.get('RSAPrivateKey')

      if ('oth' in jwk) {
        throw new errors.JOSENotSupported('Private RSA keys with more than two primes are not supported')
      }

      if (jwk.p || jwk.q || jwk.dp || jwk.dq || jwk.qi) {
        if (!(jwk.p && jwk.q && jwk.dp && jwk.dq && jwk.qi)) {
          throw new errors.JWKInvalid('all other private key parameters must be present when any one of them is present')
        }
      } else if (calculateMissingRSAPrimes) {
        jwk = computePrimes(jwk)
      } else if (!calculateMissingRSAPrimes) {
        throw new errors.JOSENotSupported('importing private RSA keys without all other private key parameters is not enabled, see documentation and its advisory on how and when its ok to enable it')
      }

      return RSAPrivateKey.encode({
        version: 0,
        n: BigInt(`0x${base64url.decodeToBuffer(jwk.n).toString('hex')}`),
        e: BigInt(`0x${base64url.decodeToBuffer(jwk.e).toString('hex')}`),
        d: BigInt(`0x${base64url.decodeToBuffer(jwk.d).toString('hex')}`),
        p: BigInt(`0x${base64url.decodeToBuffer(jwk.p).toString('hex')}`),
        q: BigInt(`0x${base64url.decodeToBuffer(jwk.q).toString('hex')}`),
        dp: BigInt(`0x${base64url.decodeToBuffer(jwk.dp).toString('hex')}`),
        dq: BigInt(`0x${base64url.decodeToBuffer(jwk.dq).toString('hex')}`),
        qi: BigInt(`0x${base64url.decodeToBuffer(jwk.qi).toString('hex')}`)
      }, 'pem', { label: 'RSA PRIVATE KEY' })
    },
    public (jwk) {
      const RSAPublicKey = asn1.get('RSAPublicKey')

      return RSAPublicKey.encode({
        version: 0,
        n: BigInt(`0x${base64url.decodeToBuffer(jwk.n).toString('hex')}`),
        e: BigInt(`0x${base64url.decodeToBuffer(jwk.e).toString('hex')}`)
      }, 'pem', { label: 'RSA PUBLIC KEY' })
    }
  },
  EC: {
    private (jwk) {
      const ECPrivateKey = asn1.get('ECPrivateKey')

      return ECPrivateKey.encode({
        version: 1,
        privateKey: base64url.decodeToBuffer(jwk.d),
        parameters: { type: 'namedCurve', value: jwk.crv },
        publicKey: concatEcPublicKey(jwk.x, jwk.y)
      }, 'pem', { label: 'EC PRIVATE KEY' })
    },
    public (jwk) {
      const PublicKeyInfo = asn1.get('PublicKeyInfo')

      return PublicKeyInfo.encode({
        algorithm: {
          algorithm: 'ecPublicKey',
          parameters: { type: 'namedCurve', value: jwk.crv }
        },
        publicKey: concatEcPublicKey(jwk.x, jwk.y)
      }, 'pem', { label: 'PUBLIC KEY' })
    }
  },
  OKP: {
    private (jwk) {
      const OneAsymmetricKey = asn1.get('OneAsymmetricKey')

      const b64 = OneAsymmetricKey.encode({
        version: 0,
        privateKey: { privateKey: base64url.decodeToBuffer(jwk.d) },
        algorithm: { algorithm: jwk.crv }
      }, 'der')

      // TODO: WHYYY? https://github.com/indutny/asn1.js/issues/110
      b64.write('04', 12, 1, 'hex')

      return formatPem(b64.toString('base64'), 'PRIVATE')
    },
    public (jwk) {
      const PublicKeyInfo = asn1.get('PublicKeyInfo')

      return PublicKeyInfo.encode({
        algorithm: { algorithm: jwk.crv },
        publicKey: {
          unused: 0,
          data: base64url.decodeToBuffer(jwk.x)
        }
      }, 'pem', { label: 'PUBLIC KEY' })
    }
  }
}

module.exports.jwkToPem = (jwk, { calculateMissingRSAPrimes = false } = {}) => {
  switch (jwk.kty) {
    case 'EC':
      if (!EC_CURVES.has(jwk.crv)) {
        throw new errors.JOSENotSupported(`unsupported EC key curve: ${jwk.crv}`)
      }
      break
    case 'OKP':
      if (!OKP_CURVES.has(jwk.crv)) {
        throw new errors.JOSENotSupported(`unsupported OKP key curve: ${jwk.crv}`)
      }
      break
    case 'RSA':
      break
    default:
      throw new errors.JOSENotSupported(`unsupported key type: ${jwk.kty}`)
  }

  if (jwk.d) {
    return jwkToPem[jwk.kty].private(jwk, { calculateMissingRSAPrimes })
  }

  return jwkToPem[jwk.kty].public(jwk)
}
