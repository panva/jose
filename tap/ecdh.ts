import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'
import roundtrip from './encrypt.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('ecdh.ts')

  type Vector = [string, boolean] | [string, boolean, jose.GenerateKeyPairOptions]
  const algorithms: Vector[] = [
    ['ECDH-ES', true],
    ['ECDH-ES', true, { crv: 'P-384' }],
    ['ECDH-ES', !env.isDeno, { crv: 'P-521' }],
    ['ECDH-ES', false, { crv: 'secp256k1' }],
    ['ECDH-ES', env.isNode || env.isElectron, { crv: 'X25519' }],
    ['ECDH-ES', env.isNode, { crv: 'X448' }],
  ]

  function title(vector: Vector) {
    const [alg, works, options] = vector
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg} ${options?.crv || 'P-256'}`
    return result
  }

  for (const vector of algorithms) {
    const [alg, works, options] = vector

    const execute = async (t: typeof QUnit.assert) => {
      const kp = await lib.generateKeyPair(alg, options)
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
