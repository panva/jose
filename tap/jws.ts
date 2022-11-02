import type QUnit from 'qunit'
// @ts-ignore
import * as lib from '#dist/webapi'
import * as env from './env.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('jws.ts')

  type Vector = [string, undefined | lib.GenerateKeyPairOptions, boolean]
  const algorithms: Vector[] = [
    ['EdDSA', { crv: 'Ed25519' }, env.isDeno || env.isWorkers || env.isNode],
    ['EdDSA', { crv: 'Ed448' }, env.isNode],
    ['ES256', undefined, true],
    ['ES256K', undefined, false],
    ['ES384', undefined, true],
    ['ES512', undefined, !env.isDeno],
    ['PS256', undefined, true],
    ['PS384', undefined, true],
    ['PS512', undefined, true],
    ['RS256', undefined, true],
    ['RS384', undefined, true],
    ['RS512', undefined, true],
  ]

  function title(vector: Vector) {
    const [alg, options, works] = vector
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg}`
    if (options) {
      result += `, ${JSON.stringify(options)}`
    }
    return result
  }

  for (const vector of algorithms) {
    const [alg, options, works] = vector

    const execute = async (t: typeof QUnit.assert) => {
      const { privateKey, publicKey } = await lib.generateKeyPair(alg, options)
      const jws = await new lib.FlattenedSign(crypto.getRandomValues(new Uint8Array(32)))
        .setProtectedHeader({ alg })
        .sign(privateKey)
      await lib.flattenedVerify(jws, publicKey)
      t.ok(1)
    }

    if (works) {
      test(title(vector), execute)
    } else {
      test(title(vector), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
