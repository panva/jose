import type QUnit from 'qunit'
// @ts-ignore
import * as lib from '#dist/webapi'
import * as env from './env.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('aes.ts')

  type Vector = [string, boolean]
  const algorithms: Vector[] = [
    ['A128GCM', true],
    ['A192GCM', !env.isChromium],
    ['A256GCM', true],
    ['A128CBC-HS256', true],
    ['A192CBC-HS384', !env.isChromium],
    ['A256CBC-HS512', true],
  ]

  function title(vector: Vector) {
    const [enc, works] = vector
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${enc}`
    return result
  }

  for (const vector of algorithms) {
    const [enc, works] = vector

    const execute = async (t: typeof QUnit.assert) => {
      const secret = await lib.generateSecret(enc)

      const jwe = await new lib.FlattenedEncrypt(crypto.getRandomValues(new Uint8Array(32)))
        .setProtectedHeader({ alg: 'dir', enc })
        .setAdditionalAuthenticatedData(crypto.getRandomValues(new Uint8Array(32)))
        .encrypt(secret)

      await lib.flattenedDecrypt(jwe, secret)
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
