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
  module('pbes2.ts')

  const algorithms = ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW']

  function title(alg: string, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${alg}`
    return result
  }

  for (const alg of algorithms) {
    const execute = async (t: typeof QUnit.assert) => {
      const password = new TextEncoder().encode('letmein')
      await roundtrip.jwe(t, lib, keys, alg, 'A128GCM', password)
    }

    const jwt = async (t: typeof QUnit.assert) => {
      const password = new TextEncoder().encode('letmein')
      await roundtrip.jwt(t, lib, keys, alg, 'A128GCM', password)
    }

    if (env.supported(alg)) {
      test(title(alg), execute)
      test(`${title(alg)} JWT`, jwt)
    } else {
      test(title(alg, true), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
