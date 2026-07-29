import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('general.ts')

  const plaintext = crypto.getRandomValues(new Uint8Array(64))
  const aad = crypto.getRandomValues(new Uint8Array(16))

  test('General JWE with multiple recipients', async (t) => {
    const a = await keys.generateSecret('A256KW', { extractable: true })
    const b = await keys.generateKeyPair('RSA-OAEP-256', { extractable: true })
    const c = crypto.getRandomValues(new Uint8Array(32))

    const jwe = await new lib.GeneralEncrypt(plaintext)
      .setProtectedHeader({ enc: 'A256GCM' })
      .setAdditionalAuthenticatedData(aad)
      .addRecipient(a)
      .setUnprotectedHeader({ alg: 'A256KW' })
      .addRecipient(b.publicKey)
      .setUnprotectedHeader({ alg: 'RSA-OAEP-256' })
      .addRecipient(c)
      .setUnprotectedHeader({ alg: 'A256GCMKW' })
      .encrypt()

    t.equal(jwe.recipients.length, 3)

    for (const key of [a, b.privateKey, c]) {
      const { plaintext: pt, additionalAuthenticatedData } = await lib.generalDecrypt(jwe, key)
      t.deepEqual([...pt], [...plaintext])
      t.deepEqual([...additionalAuthenticatedData!], [...aad])
    }

    // a key that matches no recipient
    const stranger = await keys.generateSecret('A256KW', { extractable: true })
    await t.rejects(lib.generalDecrypt(jwe, stranger), 'decryption operation failed')
  })

  test('General JWS with multiple signatures', async (t) => {
    const a = await keys.generateKeyPair('ES256', { extractable: true })
    const b = await keys.generateSecret('HS256', { extractable: true })

    const jws = await new lib.GeneralSign(plaintext)
      .addSignature(a.privateKey)
      .setProtectedHeader({ alg: 'ES256' })
      .addSignature(b)
      .setProtectedHeader({ alg: 'HS256' })
      .sign()

    t.equal(jws.signatures.length, 2)

    for (const key of [a.publicKey, b]) {
      const { payload } = await lib.generalVerify(jws, key)
      t.deepEqual([...payload], [...plaintext])
    }

    const stranger = await keys.generateSecret('HS256', { extractable: true })
    await t.rejects(lib.generalVerify(jws, stranger), 'signature verification failed')
  })
}
