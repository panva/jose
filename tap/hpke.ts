import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'

const hasGetPublicKey = typeof (crypto.subtle as any).getPublicKey === 'function'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('hpke.ts')

  const kps: Record<string, jose.GenerateKeyPairResult> = {}

  const algorithms = ['HPKE-0', 'HPKE-4', 'HPKE-7']

  function title(alg: string, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += alg
    return result
  }

  for (const alg of algorithms) {
    const execute = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(
          alg,
          hasGetPublicKey ? undefined : { extractable: true },
        )
      }

      const cleartext = crypto.getRandomValues(new Uint8Array(16))

      // Test CryptoKey inputs
      {
        const aad = crypto.getRandomValues(new Uint8Array(16))
        const jwe = await new lib.FlattenedEncrypt(cleartext)
          .setProtectedHeader({ alg })
          .setAdditionalAuthenticatedData(aad)
          .encrypt(kps[alg].publicKey)

        for (const key of [kps[alg].privateKey, async () => kps[alg].privateKey]) {
          // @ts-ignore
          const decrypted = await lib.flattenedDecrypt(jwe, key, {
            keyManagementAlgorithms: [alg],
          })
          t.deepEqual([...decrypted.plaintext], [...cleartext])
          t.deepEqual([...decrypted.additionalAuthenticatedData!], [...aad])
        }
      }

      // Test JWK inputs
      {
        const extractableKp = hasGetPublicKey
          ? await keys.generateKeyPair(alg, { extractable: true })
          : kps[alg]
        const [eJwk, dJwk] = await Promise.all([
          keys.exportJWK(extractableKp.publicKey),
          keys.exportJWK(extractableKp.privateKey),
        ])
        const aad = crypto.getRandomValues(new Uint8Array(16))

        const jwe = await new lib.FlattenedEncrypt(cleartext)
          .setProtectedHeader({ alg })
          .setAdditionalAuthenticatedData(aad)
          .encrypt(eJwk)

        {
          const eJwkProps = structuredClone(eJwk)
          eJwkProps.alg = alg
          eJwkProps.use = 'enc'
          eJwkProps.key_ops = []
          await new lib.FlattenedEncrypt(cleartext)
            .setProtectedHeader({ alg })
            .setAdditionalAuthenticatedData(aad)
            .encrypt(eJwkProps)
        }

        if (hasGetPublicKey) {
          const dJwkProps = structuredClone(dJwk)
          dJwkProps.alg = alg
          dJwkProps.use = 'enc'
          dJwkProps.key_ops = ['deriveBits']

          for (const key of [dJwk, async () => dJwk, dJwkProps, async () => dJwkProps]) {
            // @ts-ignore
            const decrypted = await lib.flattenedDecrypt(jwe, key, {
              keyManagementAlgorithms: [alg],
            })
            t.deepEqual([...decrypted.plaintext], [...cleartext])
            t.deepEqual([...decrypted.additionalAuthenticatedData!], [...aad])
          }
        }
      }
    }

    const jwt = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(
          alg,
          hasGetPublicKey ? undefined : { extractable: true },
        )
      }

      const [eKey, dKey] = [kps[alg].publicKey, kps[alg].privateKey]

      const token = await new lib.EncryptJWT({ foo: 'bar' })
        .setProtectedHeader({ alg })
        .encrypt(eKey)

      for (const key of [dKey, async () => dKey]) {
        // @ts-ignore
        const decrypted = await lib.jwtDecrypt(token, key, {
          keyManagementAlgorithms: [alg],
        })
        t.propContains(decrypted, {
          payload: { foo: 'bar' },
          protectedHeader: { alg },
        })
      }
    }

    const pskMode = async (t: typeof QUnit.assert) => {
      if (!kps[alg]) {
        kps[alg] = await keys.generateKeyPair(
          alg,
          hasGetPublicKey ? undefined : { extractable: true },
        )
      }

      const cleartext = crypto.getRandomValues(new Uint8Array(16))
      const psk = crypto.getRandomValues(new Uint8Array(32))
      const psk_id = crypto.getRandomValues(new Uint8Array(16))

      const jwe = await new lib.FlattenedEncrypt(cleartext)
        .setProtectedHeader({ alg })
        .setKeyManagementParameters({ psk, psk_id })
        .encrypt(kps[alg].publicKey)

      // psk_id must be in the protected header
      const protectedHeader = JSON.parse(
        new TextDecoder().decode(lib.base64url.decode(jwe.protected!)),
      )
      t.ok(typeof protectedHeader.psk_id === 'string', 'psk_id is in the protected header')

      // decrypt: psk_id is taken from the header, only psk is an option
      const decrypted = await lib.flattenedDecrypt(jwe, kps[alg].privateKey, {
        keyManagementAlgorithms: [alg],
        psk,
      })
      t.deepEqual([...decrypted.plaintext], [...cleartext])

      // decrypt without psk should fail
      await t.rejects(
        lib.flattenedDecrypt(jwe, kps[alg].privateKey, {
          keyManagementAlgorithms: [alg],
        }),
      )

      // decrypt with wrong psk should fail
      const wrongPsk = crypto.getRandomValues(new Uint8Array(32))
      await t.rejects(
        lib.flattenedDecrypt(jwe, kps[alg].privateKey, {
          keyManagementAlgorithms: [alg],
          psk: wrongPsk,
        }),
      )
    }

    const nonExtractable = async (t: typeof QUnit.assert) => {
      const kp = await lib.generateKeyPair(alg)
      const cleartext = crypto.getRandomValues(new Uint8Array(16))
      const jwe = await new lib.FlattenedEncrypt(cleartext)
        .setProtectedHeader({ alg })
        .encrypt(kp.publicKey)
      await t.rejects(
        lib.flattenedDecrypt(jwe, kp.privateKey, { keyManagementAlgorithms: [alg] }),
        (err: jose.errors.JOSEError) => err.code === 'ERR_JOSE_NOT_SUPPORTED',
      )
    }

    if (env.supported(alg)) {
      test(title(alg), execute)
      test(`${title(alg)} JWT`, jwt)
      test(`${title(alg)} PSK mode`, pskMode)
      if (!hasGetPublicKey) {
        test(`${title(alg)} non-extractable key`, nonExtractable)
      }
    } else {
      test(title(alg, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
