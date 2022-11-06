import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'
import random from './random.js'
import roundtrip from './encrypt.js'

export default (QUnit: QUnit, lib: typeof jose) => {
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

  function title(vector: Vector, label = '') {
    const [enc, works] = vector
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${enc}`
    if (label) {
      result += ` ${label}`
    }
    return result
  }

  function secretsFor(enc: string) {
    return [
      lib.generateSecret(enc),
      random(parseInt(enc.endsWith('GCM') ? enc.slice(1, 4) : enc.slice(-3)) >> 3),
    ]
  }

  for (const vector of algorithms) {
    const [enc, works] = vector

    const execute = async (t: typeof QUnit.assert) => {
      for await (const secret of secretsFor(enc)) {
        await roundtrip(t, lib, 'dir', enc, secret)
      }
    }

    const emptyClearText = async (t: typeof QUnit.assert) => {
      for await (const secret of secretsFor(enc)) {
        await roundtrip(t, lib, 'dir', enc, secret, new Uint8Array())
      }
    }

    if (works) {
      test(title(vector), execute)

      // TODO: https://github.com/oven-sh/bun/issues/1466
      test(title(vector, 'empty cleartext'), emptyClearText)
    } else {
      test(title(vector), async (t) => {
        await t.rejects(execute(t))
      })
      test(title(vector, 'empty cleartext'), async (t) => {
        await t.rejects(emptyClearText(t))
      })
    }
  }
}
