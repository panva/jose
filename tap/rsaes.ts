import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import * as roundtrip from './encrypt.js'
import * as env from './env.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('rsaes.ts')

  const kps: Record<string, jose.GenerateKeyPairResult> = {}

  const algorithms = ['RSA-OAEP', 'RSA-OAEP-256', 'RSA-OAEP-384', 'RSA-OAEP-512']

  function title(alg: string, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${alg}`
    return result
  }

  for (const alg of algorithms) {
    const execute = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(alg, { extractable: true })
      }

      await roundtrip.jwe(t, lib, keys, alg, 'A128GCM', kps[alg])
    }

    const jwt = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(alg, { extractable: true })
      }

      await roundtrip.jwt(t, lib, keys, alg, 'A128GCM', kps[alg])
    }

    if (env.supported(alg)) {
      test(title(alg), execute)
      test(`${title(alg)} JWT`, jwt)
    } else {
      test(title(alg, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
