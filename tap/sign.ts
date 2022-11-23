import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import random from './random.js'

function isKeyPair(
  input: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
): input is jose.GenerateKeyPairResult {
  return 'publicKey' in input && 'privateKey' in input
}

export async function jws(
  t: typeof QUnit.assert,
  lib: typeof jose,
  alg: string,
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
  payload = random(),
) {
  const sKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  const vKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair

  const jws = await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(sKey)

  const verified = await lib.flattenedVerify(jws, vKey)
  t.deepEqual([...verified.payload], [...payload])
}

export async function jwt(
  t: typeof QUnit.assert,
  lib: typeof jose,
  alg: string,
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
) {
  const sKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  const vKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair

  const jwt = await new lib.SignJWT({ foo: 'bar' }).setProtectedHeader({ alg }).sign(sKey)

  const verified = await lib.jwtVerify(jwt, vKey)
  t.deepEqual(verified, {
    payload: {
      foo: 'bar',
    },
    protectedHeader: {
      alg,
    },
  })
}
