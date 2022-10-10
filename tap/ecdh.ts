import type QUnit from 'qunit'
import * as lib from '#dist/webapi'
import * as env from './env.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('ecdh.ts')

  type Vector = [string, undefined | lib.GenerateKeyPairOptions, boolean]
  const algorithms: Vector[] = [
    ['ECDH-ES', { crv: 'P-256' }, true],
    ['ECDH-ES', { crv: 'P-384' }, true],
    ['ECDH-ES', { crv: 'P-521' }, !env.isDeno],
    ['ECDH-ES', { crv: 'secp256k1' }, false],
    ['ECDH-ES', { crv: 'X25519' }, false],
    ['ECDH-ES', { crv: 'X448' }, false],
  ]

  function title(vector: Vector) {
    const [alg, options, works] = vector
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg}`
    if (alg === 'ECDH-ES') {
      result += ` ${options.crv}`
    }
    return result
  }

  for (const vector of algorithms) {
    const [alg, options, works] = vector

    const execute = async (t: typeof QUnit.assert) => {
      const { privateKey, publicKey } = await lib.generateKeyPair(alg, options)

      const jwe = await new lib.FlattenedEncrypt(crypto.getRandomValues(new Uint8Array(32)))
        .setProtectedHeader({ alg, enc: 'A256GCM' })
        .setAdditionalAuthenticatedData(crypto.getRandomValues(new Uint8Array(32)))
        .encrypt(publicKey)

      await lib.flattenedDecrypt(jwe, privateKey)
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
