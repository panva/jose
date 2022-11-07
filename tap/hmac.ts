import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import random from './random.js'
import roundtrip from './sign.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('hmac.ts')

  const algorithms = ['HS256', 'HS384', 'HS512']

  function digestSizeSecretsFor(alg: string) {
    return [lib.generateSecret(alg), random(parseInt(alg.slice(2, 5), 10) >> 3)]
  }

  function nonDigestSizeSecretFor(alg: string) {
    const length = parseInt(alg.slice(2, 5), 10) >> 3
    return [random(length - 1), random(length + 1)]
  }

  for (const alg of algorithms) {
    test(alg, async (t) => {
      for await (const secret of digestSizeSecretsFor(alg)) {
        await roundtrip(t, lib, alg, secret)
      }
    })

    test(`${alg} w/ non-digest output length secrets`, async (t) => {
      for await (const secret of nonDigestSizeSecretFor(alg)) {
        await roundtrip(t, lib, alg, secret)
      }
    })
  }
}
