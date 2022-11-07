import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'
import roundtrip from './encrypt.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('rsaes.ts')

  type Vector = [string, boolean]
  const algorithms: Vector[] = [
    ['RSA1_5', env.isNodeCrypto || env.isElectron],
    ['RSA-OAEP', true],
    ['RSA-OAEP-256', true],
    ['RSA-OAEP-384', true],
    ['RSA-OAEP-512', true],
  ]

  function title(vector: Vector) {
    const [alg, works] = vector
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg}`
    return result
  }

  for (const vector of algorithms) {
    const [alg, works] = vector

    const execute = async (t: typeof QUnit.assert) => {
      const kp = await lib.generateKeyPair(alg)
      await roundtrip(t, lib, alg, 'A128GCM', kp)
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
