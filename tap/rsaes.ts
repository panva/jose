import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import * as roundtrip from './encrypt.js'

export default (QUnit: QUnit, lib: typeof jose, keys: typeof jose) => {
  const { module, test } = QUnit
  module('rsaes.ts')

  const kps: Record<string, jose.GenerateKeyPairResult> = {}

  type Vector = [string, boolean]
  const algorithms: Vector[] = [
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
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(alg)
      }

      await roundtrip.jwe(t, lib, alg, 'A128GCM', kps[alg])
    }

    const jwt = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(alg)
      }

      await roundtrip.jwt(t, lib, alg, 'A128GCM', kps[alg])
    }

    if (works) {
      test(title(vector), execute)
      test(`${title(vector)} JWT`, jwt)
    } else {
      test(title(vector), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
