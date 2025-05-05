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
  module('ecdh.ts')

  const kps: Record<string, jose.GenerateKeyPairResult> = {}

  type Vector = [string, jose.GenerateKeyPairOptions]
  const algorithms: Vector[] = [
    ['ECDH-ES', { crv: 'P-256' }],
    ['ECDH-ES', { crv: 'P-384' }],
    ['ECDH-ES', { crv: 'P-521' }],
    ['ECDH-ES', { crv: 'X25519' }],
  ]

  function curve(options?: jose.GenerateKeyPairOptions) {
    return options?.crv || 'P-256'
  }

  function title(vector: Vector, supported = true) {
    const [alg, options] = vector
    let result = ''
    const crv = curve(options)
    if (!supported) {
      result = '[not supported] '
    }
    result += `${alg} ${crv}`
    return result
  }

  for (const vector of algorithms) {
    const [alg, options] = vector
    const k = options?.crv || alg

    const execute = async (t: typeof QUnit.assert) => {
      if (!kps[k]) {
        kps[k] = await keys.generateKeyPair(alg, { ...options, extractable: true })
      }
      await roundtrip.jwe(t, lib, keys, alg, 'A128GCM', kps[k])
    }

    const jwt = async (t: typeof QUnit.assert) => {
      if (!kps[k]) {
        kps[k] = await keys.generateKeyPair(alg, { ...options, extractable: true })
      }
      await roundtrip.jwt(t, lib, keys, alg, 'A128GCM', kps[k])
    }

    if (env.supported(alg) && env.supported(curve(options))) {
      test(title(vector), execute)
      test(`${title(vector)} JWT`, jwt)
    } else {
      test(title(vector, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
