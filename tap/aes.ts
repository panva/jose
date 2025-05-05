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
  module('aes.ts')

  const algorithms = [
    'A128GCM',
    'A192GCM',
    'A256GCM',
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512',
  ]

  function title(algorithm: string) {
    const supported = env.supported(algorithm)
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${algorithm}`
    return result
  }

  function secretsFor(enc: string) {
    return [
      keys.generateSecret(enc, { extractable: true }),
      crypto.getRandomValues(
        new Uint8Array(parseInt(enc.endsWith('GCM') ? enc.slice(1, 4) : enc.slice(-3)) >> 3),
      ),
    ]
  }

  for (const enc of algorithms) {
    const execute = async (t: typeof QUnit.assert) => {
      for await (const secret of secretsFor(enc)) {
        await roundtrip.jwe(t, lib, keys, 'dir', enc, secret)
      }
    }

    const jwt = async (t: typeof QUnit.assert) => {
      await roundtrip.jwt(t, lib, keys, 'dir', enc, await secretsFor(enc)[0])
    }

    if (env.supported(enc)) {
      test(title(enc), execute)
      test(`${title(enc)} JWT`, jwt)
    } else {
      test(title(enc), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
