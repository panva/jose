import type QUnit from 'qunit'
import * as env from './env.js'
import { KEYS } from './fixtures.js'
import type * as jose from '../src/index.js'

export default (QUnit: QUnit, lib: typeof jose, keys: typeof jose) => {
  const { module, test } = QUnit
  module('jwk.ts')

  type Vector = [string, JsonWebKey, boolean | [boolean, boolean]]

  const algorithms: Vector[] = [
    ['ECDH-ES', KEYS.P256.jwk, true],
    ['ECDH-ES', KEYS.P384.jwk, true],
    ['ECDH-ES', KEYS.P521.jwk, env.isDeno ? [true, false] : true],
    [
      'ECDH-ES',
      KEYS.X25519.jwk,
      env.isNode ||
        env.isDeno ||
        env.isElectron ||
        env.isWorkerd ||
        env.isEdgeRuntime ||
        (env.isGecko && env.isBrowserVersionAtLeast(130)) ||
        (env.isBlink && env.isBrowserVersionAtLeast(133)),
    ],
    ['ECDH-ES', KEYS.X448.jwk, env.isDeno ? [true, false] : env.isNode || env.isEdgeRuntime],
    ['EdDSA', KEYS.Ed25519.jwk, !env.isBlink],
    ['EdDSA', KEYS.Ed448.jwk, env.isNode || env.isEdgeRuntime],
    ['ES256', KEYS.P256.jwk, true],
    ['ES256K', KEYS.secp256k1.jwk, lib.cryptoRuntime === 'node:crypto' && !env.isElectron],
    ['ES384', KEYS.P384.jwk, true],
    ['ES512', KEYS.P521.jwk, env.isDeno ? [true, false] : true],
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
  ]

  function publicJwk(jwk: JsonWebKey) {
    const { d, p, q, dp, dq, qi, k, ...result } = jwk
    return result
  }

  for (const vector of algorithms.slice()) {
    if (typeof vector[2] !== 'boolean') {
      let [pub, priv] = vector[2]
      vector[2] = priv
      algorithms.push([vector[0], publicJwk(vector[1]), pub])
    } else {
      algorithms.push([vector[0], publicJwk(vector[1]), vector[2]])
    }
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
    const [, , works] = vector

    if (typeof works !== 'boolean') {
      throw new Error()
    }

    const execute = async (t: typeof QUnit.assert) => {
      const key = await lib.importJWK({ ...jwk, ext: true }, alg)

      const exported = await lib.exportJWK(key)

      for (const prop of [...new Set([...Object.keys(jwk), ...Object.keys(exported)])]) {
        t.strictEqual(exported[prop], jwk[prop as keyof JsonWebKey], `${prop} mismatch`)
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

  // test('alg argument and jwk.alg is ignored for oct JWKs', async (t) => {
  //   const oct = {
  //     k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
  //     kty: 'oct',
  //   }
  //   await lib.importJWK(oct)
  //   t.ok(1)
  // })

  // if (lib.cryptoRuntime === 'node:crypto') {
  //   test('alg argument is ignored if jwk does not have alg for asymmetric keys', async (t) => {
  //     const jwk = {
  //       kty: 'EC',
  //       crv: 'P-256',
  //       x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
  //       y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
  //     }
  //     await lib.importJWK(jwk)
  //     t.ok(1)
  //   })
  // } else {
  //   test('alg argument must be present if jwk does not have alg for asymmetric keys', async (t) => {
  //     const jwk = {
  //       kty: 'EC',
  //       crv: 'P-256',
  //       x: 'jJ6Flys3zK9jUhnOHf6G49Dyp5hah6CNP84-gY-n9eo',
  //       y: 'nhI6iD5eFXgBTLt_1p3aip-5VbZeMhxeFSpjfEAf7Ww',
  //     }
  //     await t.rejects(
  //       lib.importJWK(jwk),
  //       '"alg" argument is required when "jwk.alg" is not present',
  //     )
  //     await lib.importJWK(jwk, 'ES256')
  //     await lib.importJWK({ ...jwk, alg: 'ES256' })
  //   })
  // }
}
