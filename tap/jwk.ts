import type QUnit from 'qunit'
import * as env from './env.js'
import { KEYS } from './fixtures.js'
import type * as jose from '../src/index.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('jwk.ts')

  type Vector = [string, JsonWebKey, boolean] | [string, JsonWebKey, boolean, boolean]
  const algorithms: Vector[] = [
    ['ECDH-ES', KEYS.P256.jwk, true],
    ['ECDH-ES', KEYS.P384.jwk, true],
    ['ECDH-ES', KEYS.P521.jwk, !env.isDeno],
    [
      'ECDH-ES',
      KEYS.X25519.jwk,
      env.isDeno || env.isNode || env.isElectron || env.isWorkerd,
      env.isDeno,
    ],
    ['ECDH-ES', KEYS.X448.jwk, env.isNode],
    ['EdDSA', KEYS.Ed25519.jwk, !(env.isBrowser || env.isEdgeRuntime)],
    ['EdDSA', KEYS.Ed448.jwk, env.isNode],
    ['ES256', KEYS.P256.jwk, true],
    ['ES256K', KEYS.secp256k1.jwk, env.isNodeCrypto],
    ['ES384', KEYS.P384.jwk, true],
    ['ES512', KEYS.P521.jwk, !env.isDeno],
    ['PS256', KEYS.RSA.jwk, true],
    ['PS384', KEYS.RSA.jwk, true],
    ['PS512', KEYS.RSA.jwk, true],
    ['RS256', KEYS.RSA.jwk, true],
    ['RS384', KEYS.RSA.jwk, true],
    ['RS512', KEYS.RSA.jwk, true],
    ['RSA-OAEP-256', KEYS.RSA.jwk, true],
    ['RSA-OAEP-384', KEYS.RSA.jwk, true],
    ['RSA-OAEP-512', KEYS.RSA.jwk, true],
    ['RSA-OAEP', KEYS.RSA.jwk, true],
    ['RSA1_5', KEYS.RSA.jwk, env.isNodeCrypto || env.isElectron],
  ]

  function publicJwk(jwk: JsonWebKey) {
    const { d, p, q, dp, dq, qi, k, ...result } = jwk
    return result
  }

  for (const vector of algorithms.slice()) {
    algorithms.push([vector[0], publicJwk(vector[1]), vector[2]])
  }

  function title(alg: string, jwk: JsonWebKey, works: boolean) {
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg} `
    if (alg === 'EdDSA' || alg === 'ECDH-ES') {
      result += `${jwk.crv} `
    }
    result += jwk.d ? 'Private' : 'Public'
    result += ' JWK Import'
    return result
  }

  for (const vector of algorithms) {
    const [alg, jwk] = vector
    let [, , works, exportNotImplemented] = vector

    const execute = async (t: typeof QUnit.assert) => {
      const key = await lib.importJWK({ ...jwk, ext: true }, alg)
      if (exportNotImplemented) {
        try {
          await lib.exportJWK(key)
          throw new Error()
        } catch (err) {
          t.strictEqual((<Error>err).name, 'NotSupportedError')
        }
      } else {
        const exported = await lib.exportJWK(key)

        for (const prop of [...new Set([...Object.keys(jwk), ...Object.keys(exported)])]) {
          t.strictEqual(exported[prop], jwk[<keyof JsonWebKey>prop], `${prop} mismatch`)
        }
      }

      t.ok(1)
    }

    if (works) {
      test(title(alg, jwk, works), execute)
    } else {
      test(title(alg, jwk, works), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }

  if (env.isNodeCrypto || env.isElectron) {
    test('alg argument and jwk.alg is ignored', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
      }
      await lib.importJWK(oct)
      t.ok(1)
    })
  } else {
    test('alg argument must be present if jwk does not have alg', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
      }
      await t.rejects(
        lib.importJWK(oct),
        '"alg" argument is required when "jwk.alg" is not present',
      )
      await lib.importJWK(oct, 'HS256')
      await lib.importJWK({ ...oct, alg: 'HS256' })
    })
  }
}
