import type QUnit from 'qunit'
import * as env from './env.js'
import { KEYS } from './fixtures.js'
import type * as jose from '../src/index.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  _keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
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
    ['Ed25519', KEYS.Ed25519.jwk, !env.isBlink],
    ['EdDSA', KEYS.Ed25519.jwk, !env.isBlink],
    ['ES256', KEYS.P256.jwk, true],
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
      const key = await lib.importJWK({ ...jwk, ext: true } as jose.JWK, alg)

      const exported = await lib.exportJWK(key)

      for (const prop of [...new Set([...Object.keys(jwk), ...Object.keys(exported)])]) {
        t.strictEqual(
          exported[prop as keyof JsonWebKey],
          jwk[prop as keyof JsonWebKey],
          `${prop} mismatch`,
        )
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
}
