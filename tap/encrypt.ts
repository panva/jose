import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import random from './random.js'

function isKeyPair(
  input: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
): input is jose.GenerateKeyPairResult {
  return 'publicKey' in input && 'privateKey' in input
}

export default async (
  t: typeof QUnit.assert,
  lib: typeof jose,
  alg: string,
  enc: string,
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
  cleartext = random(),
) => {
  const eKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair
  const dKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  const aad = random()

  const jwe = await new lib.FlattenedEncrypt(cleartext)
    .setProtectedHeader({ alg, enc })
    .setAdditionalAuthenticatedData(aad)
    .encrypt(eKey)

  const decrypted = await lib.flattenedDecrypt(jwe, dKey)
  t.deepEqual([...decrypted.plaintext], [...cleartext])
  t.deepEqual([...decrypted.additionalAuthenticatedData!], [...aad])
}
