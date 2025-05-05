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
  module('aeskw.ts')

  const algorithms = ['A128KW', 'A192KW', 'A256KW', 'A128GCMKW', 'A192GCMKW', 'A256GCMKW']

  function title(algorithm: string, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${algorithm}`
    return result
  }

  function secretsFor(alg: string) {
    return [
      keys.generateSecret(alg, { extractable: true }),
      crypto.getRandomValues(new Uint8Array(parseInt(alg.slice(1, 4), 10) >> 3)),
    ]
  }

  for (const alg of algorithms) {
    const execute = async (t: typeof QUnit.assert) => {
      for await (const secret of secretsFor(alg)) {
        await roundtrip.jwe(t, lib, keys, alg, 'A128GCM', secret)
      }
    }

    const jwt = async (t: typeof QUnit.assert) => {
      await roundtrip.jwt(t, lib, keys, alg, 'A128GCM', await secretsFor(alg)[0])
    }

    if (env.supported(alg)) {
      test(title(alg), execute)
      test(`${title(alg)} JWT`, jwt)
    } else {
      test(title(alg, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
