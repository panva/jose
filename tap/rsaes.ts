import type QUnit from 'qunit'
// @ts-ignore
import * as lib from '#dist/webapi'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('rsaes.ts')

  type Vector = [string, boolean]
  const algorithms: Vector[] = [
    ['RSA1_5', false],
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
      const { privateKey, publicKey } = await lib.generateKeyPair(alg)

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
