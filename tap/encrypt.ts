import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import random from './random.js'

function isKeyPair(
  input: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
): input is jose.GenerateKeyPairResult {
  return 'publicKey' in input && 'privateKey' in input
}

export async function jwe(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  enc: string,
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
  cleartext = random(),
) {
  const eKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair
  const dKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  const aad = random()

  const jwe = await new lib.FlattenedEncrypt(cleartext)
    .setProtectedHeader({ alg, enc })
    .setAdditionalAuthenticatedData(aad)
    .encrypt(eKey)

  const decrypted = await lib.flattenedDecrypt(jwe, dKey, {
    keyManagementAlgorithms: [alg],
    contentEncryptionAlgorithms: [enc],
  })
  t.deepEqual([...decrypted.plaintext], [...cleartext])
  t.deepEqual([...decrypted.additionalAuthenticatedData!], [...aad])
}

export async function jwt(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  enc: string,
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
) {
  const eKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair
  const dKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair

  const jwt = await new lib.EncryptJWT({ foo: 'bar' })
    .setProtectedHeader({ alg, enc })
    .encrypt(eKey)

  const decrypted = await lib.jwtDecrypt(jwt, dKey, {
    keyManagementAlgorithms: [alg],
    contentEncryptionAlgorithms: [enc],
  })
  t.propContains(decrypted, {
    payload: {
      foo: 'bar',
    },
    protectedHeader: {
      alg,
      enc,
    },
  })
}
