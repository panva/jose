import type QUnit from 'qunit'
import * as lib from '#dist/webapi'
import * as env from './env.js'
import { KEYS } from './fixtures.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('jwk.ts')

  type Vector = [string, JsonWebKey, boolean | ((jwk: JsonWebKey) => boolean)]
  const algorithms: Vector[] = [
    ['ECDH-ES', KEYS.P256.jwk, true],
    ['ECDH-ES', KEYS.P384.jwk, true],
    ['ECDH-ES', KEYS.P521.jwk, !env.isDeno],
    ['ECDH-ES', KEYS.X25519.jwk, env.isDeno],
    ['ECDH-ES', KEYS.X448.jwk, false],
    ['EdDSA', KEYS.Ed25519.jwk, env.isDeno || env.isWorkers],
    ['EdDSA', KEYS.Ed448.jwk, false],
    ['ES256', KEYS.P256.jwk, true],
    ['ES256K', KEYS.secp256k1.jwk, false],
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
    ['RSA1_5', KEYS.RSA.jwk, false],
  ]

  function publicJwk(jwk: JsonWebKey) {
    const { d, k, dp, dq, q, qi, ...result } = jwk
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
    let [, , works] = vector

    if (typeof works === 'function') {
      works = works(jwk)
    }

    const execute = async (t: typeof QUnit.assert) => {
      await lib.importJWK({ ...jwk, ext: true }, alg)
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
