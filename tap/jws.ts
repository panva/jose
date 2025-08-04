import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'
import * as roundtrip from './sign.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('jws.ts')

  const algorithms = [
    'Ed25519',
    'EdDSA',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
    'RS256',
    'RS384',
    'RS512',
    'ML-DSA-44',
    'ML-DSA-65',
    'ML-DSA-87',
  ]

  const kps: Record<string, jose.GenerateKeyPairResult> = {}

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
      await roundtrip.jws(t, lib, keys, alg, kps[alg])
    }

    const jwt = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(alg, { extractable: true })
      }
      await roundtrip.jwt(t, lib, keys, alg, kps[alg])
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
