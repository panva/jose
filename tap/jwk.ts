import type QUnit from 'qunit'
import * as env from './env.js'
import { KEYS } from './fixtures.js'
import type * as jose from '../src/index.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('jwk.ts')

  type Vector = [string, JsonWebKey]

  const algorithms: Vector[] = [
    ['ECDH-ES', KEYS.P256.jwk],
    ['ECDH-ES', KEYS.P384.jwk],
    ['ECDH-ES', KEYS.P521.jwk],
    ['ECDH-ES', KEYS.X25519.jwk],
    ['Ed25519', KEYS.Ed25519.jwk],
    ['EdDSA', KEYS.Ed25519.jwk],
    ['ES256', KEYS.P256.jwk],
    ['ES384', KEYS.P384.jwk],
    ['ES512', KEYS.P521.jwk],
    ['PS256', KEYS.RSA.jwk],
    ['PS384', KEYS.RSA.jwk],
    ['PS512', KEYS.RSA.jwk],
    ['RS256', KEYS.RSA.jwk],
    ['RS384', KEYS.RSA.jwk],
    ['RS512', KEYS.RSA.jwk],
    ['RSA-OAEP-256', KEYS.RSA.jwk],
    ['RSA-OAEP-384', KEYS.RSA.jwk],
    ['RSA-OAEP-512', KEYS.RSA.jwk],
    ['RSA-OAEP', KEYS.RSA.jwk],
    ['ML-DSA-44', KEYS['ML-DSA-44'].jwk],
    ['ML-DSA-65', KEYS['ML-DSA-65'].jwk],
    ['ML-DSA-87', KEYS['ML-DSA-87'].jwk],
  ]

  function publicJwk(jwk: JsonWebKey) {
    const { d, p, q, dp, dq, qi, k, priv, ...result } = jwk
    return result
  }

  for (const vector of algorithms.slice()) {
    algorithms.push([vector[0], publicJwk(vector[1])])
  }

  function title(alg: string, jwk: JsonWebKey, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${alg} `
    if (alg === 'EdDSA' || alg === 'ECDH-ES') {
      result += `${jwk.crv} `
    }
    result += jwk.d || jwk.priv ? 'Private' : 'Public'
    result += ' JWK Import'
    return result
  }

  for (const vector of algorithms) {
    const [alg, jwk] = vector

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

      if (env.isNode && lib.importJWK !== keys.importJWK) {
        const nCrypto = globalThis.process.getBuiltinModule('node:crypto')
        t.deepEqual(
          await lib.exportJWK(
            nCrypto[jwk.d || jwk.priv ? 'createPrivateKey' : 'createPublicKey']({
              format: 'jwk',
              key: jwk,
            }),
          ),
          exported,
        )
      }

      t.ok(1)
    }

    const op = `${jwk.d || jwk.priv ? 'private' : 'public'} jwk import`
    if (env.supported(alg, op) && env.supported(jwk.crv, op)) {
      test(title(alg, jwk), execute)
    } else {
      test(title(alg, jwk, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
