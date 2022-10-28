import type QUnit from 'qunit'
// @ts-ignore
import * as lib from '#dist/webapi'
import * as env from './env.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('pbes2.ts')

  type Vector = [string, boolean]
  const algorithms: Vector[] = [
    ['PBES2-HS256+A128KW', true],
    ['PBES2-HS384+A192KW', !env.isChromium],
    ['PBES2-HS512+A256KW', true],
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
      const password = new TextEncoder().encode('letmein')

      const jwe = await new lib.FlattenedEncrypt(crypto.getRandomValues(new Uint8Array(32)))
        .setProtectedHeader({ alg, enc: 'A256GCM' })
        .setAdditionalAuthenticatedData(crypto.getRandomValues(new Uint8Array(32)))
        .encrypt(password)

      await lib.flattenedDecrypt(jwe, password)
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
