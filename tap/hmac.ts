import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('hmac.ts')

  const algorithms = ['HS256', 'HS384', 'HS512']

  for (const alg of algorithms) {
    test(alg, async (t) => {
      const secret = await lib.generateSecret(alg)
      const jws = await new lib.FlattenedSign(crypto.getRandomValues(new Uint8Array(32)))
        .setProtectedHeader({ alg })
        .sign(secret)
      await lib.flattenedVerify(jws, secret)
      t.ok(1)
    })
  }
}
