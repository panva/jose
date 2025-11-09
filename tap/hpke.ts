import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'
import * as roundtrip from './encrypt.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('hpke.ts')

  const kps: Record<string, jose.GenerateKeyPairResult> = {}

  const algorithms = [
    'HPKE-0',
    'HPKE-1',
    'HPKE-2',
    'HPKE-3',
    'HPKE-4',
    'HPKE-7',
    'HPKE-0-KE',
    'HPKE-1-KE',
    'HPKE-2-KE',
    'HPKE-3-KE',
    'HPKE-4-KE',
    'HPKE-7-KE',
  ]

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
      const enc = alg.endsWith('-KE') ? 'A128GCM' : undefined
      await roundtrip.jwe(t, lib, keys, alg, enc, kps[alg])
    }

    const jwt = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(alg, { extractable: true })
      }
      const enc = alg.endsWith('-KE') ? 'A128GCM' : undefined
      await roundtrip.jwt(t, lib, keys, alg, enc, kps[alg])
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
