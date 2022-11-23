import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'
import * as roundtrip from './encrypt.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('pbes2.ts')

  type Vector = [string, boolean]
  const algorithms: Vector[] = [
    ['PBES2-HS256+A128KW', !env.isElectron],
    ['PBES2-HS384+A192KW', !env.isChromium && !env.isElectron],
    ['PBES2-HS512+A256KW', !env.isElectron],
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
      await roundtrip.jwe(t, lib, alg, 'A128GCM', password)
    }

    const jwt = async (t: typeof QUnit.assert) => {
      const password = new TextEncoder().encode('letmein')
      await roundtrip.jwt(t, lib, alg, 'A128GCM', password)
    }

    if (works) {
      test(title(vector), execute)
      test(`${title(vector)} JWT`, jwt)
    } else {
      test(title(vector), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
