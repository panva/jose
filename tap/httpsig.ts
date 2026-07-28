import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import * as httpsig from '../src/httpsig.js'
import * as env from './env.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  _keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('httpsig.ts')

  const data = new TextEncoder().encode(
    '"@method": POST\n' +
      '"@authority": example.com\n' +
      '"@signature-params": ("@method" "@authority");created=1618884473;keyid="test-key"',
  )

  /**
   * [JOSE identifier, registry identifier, expected signature octets], the registry identifier
   * being undefined for the JOSE algorithms that have no counterpart
   */
  const algorithms: [string, string | undefined, number][] = [
    ['Ed25519', 'ed25519', 64],
    ['EdDSA', undefined, 64],
    ['ES256', 'ecdsa-p256-sha256', 64],
    ['ES384', 'ecdsa-p384-sha384', 96],
    ['ES512', undefined, 132],
    ['HS256', 'hmac-sha256', 32],
    ['HS384', undefined, 48],
    ['HS512', undefined, 64],
    ['ML-DSA-44', 'ml-dsa-44', 2420],
    ['ML-DSA-65', 'ml-dsa-65', 3309],
    ['ML-DSA-87', 'ml-dsa-87', 4627],
    ['PS256', undefined, 256],
    ['PS384', undefined, 256],
    ['PS512', 'rsa-pss-sha512', 256],
    ['RS256', 'rsa-v1_5-sha256', 256],
    ['RS384', undefined, 256],
    ['RS512', undefined, 256],
  ]

  // These primitives take CryptoKey instances, so the key helpers are used directly rather than the
  // injected ones, which may be swapped for KeyObject producing variants. The keys are named for the
  // operation they are used in, the symmetric algorithms using one secret for both.
  async function keysFor(joseAlg: string) {
    if (joseAlg.startsWith('HS')) {
      const secret = await lib.generateSecret(joseAlg)
      return { signingKey: secret, verificationKey: secret }
    }
    const { privateKey, publicKey } = await lib.generateKeyPair(joseAlg)
    return { signingKey: privateKey, verificationKey: publicKey }
  }

  function title(alg: string, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${alg}`
    return result
  }

  for (const [joseAlg, alg, octets] of algorithms) {
    const execute = async (t: typeof QUnit.assert) => {
      const { signingKey, verificationKey } = await keysFor(joseAlg)

      const signature = await httpsig.sign(joseAlg, signingKey, data)
      t.ok(signature instanceof Uint8Array)
      t.equal(signature.byteLength, octets)
      t.ok(await httpsig.verify(joseAlg, verificationKey, signature, data))

      const flipped = new Uint8Array(signature)
      flipped[0] ^= 0x01
      t.notOk(await httpsig.verify(joseAlg, verificationKey, flipped, data))

      if (alg === undefined) {
        return
      }

      // The registry identifier and the JOSE identifier are interchangeable.
      const viaRegistry = await httpsig.sign(alg, signingKey, data)
      t.equal(viaRegistry.byteLength, octets)
      t.ok(await httpsig.verify(alg, verificationKey, viaRegistry, data))
      t.ok(await httpsig.verify(joseAlg, verificationKey, viaRegistry, data))
      t.ok(await httpsig.verify(alg, verificationKey, signature, data))
    }

    if (env.supported(joseAlg)) {
      test(title(joseAlg), execute)
    } else {
      test(title(joseAlg, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }

  test('unsupported algorithms', async (t) => {
    const secret = await lib.generateSecret('HS256')
    for (const alg of ['none', 'ES256K', 'toString', '']) {
      await t.rejects(httpsig.sign(alg, secret, data))
    }
    await t.rejects(httpsig.sign(1 as unknown as string, secret, data))
    await t.rejects(httpsig.verify('hmac-sha256', secret, 'x' as unknown as Uint8Array, data))
  })
}
