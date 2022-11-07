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
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
  payload = random(),
) => {
  const sKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  const vKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair

  const jws = await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(sKey)

  const decrypted = await lib.flattenedVerify(jws, vKey)
  t.deepEqual([...decrypted.payload], [...payload])
}
