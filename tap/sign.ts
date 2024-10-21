import type QUnit from 'qunit'
import type * as jose from '../src/index.js'
import random from './random.js'

type keyType = Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult

function isKeyPair(input: keyType): input is jose.GenerateKeyPairResult {
  return 'publicKey' in input && 'privateKey' in input
}

async function getJWKs(
  secretOrKeyPair: keyType,
  jwk: false,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
): Promise<Array<Uint8Array | jose.KeyLike>>
async function getJWKs(
  secretOrKeyPair: keyType,
  jwk: true,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
): Promise<Array<jose.JWK>>
async function getJWKs(
  secretOrKeyPair: keyType,
  jwk: boolean,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) {
  let sKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  let vKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair

  if (jwk) {
    return [await keys.exportJWK(sKey), await keys.exportJWK(vKey)]
  }

  return [sKey, vKey]
}

export async function jws(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  secretOrKeyPair: keyType,
  payload = random(),
) {
  // Test Uint8Array, CryptoKey, and KeyObject key inputs
  {
    const [sKey, vKey] = await getJWKs(secretOrKeyPair, false, keys)
    const jws = await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(sKey)
    {
      const verified = await lib.flattenedVerify(jws, vKey)
      t.deepEqual([...verified.payload], [...payload])
    }
    {
      const verified = await lib.flattenedVerify(jws, async () => vKey)
      t.deepEqual(verified, {
        key: vKey,
        payload,
        protectedHeader: { alg },
      })
    }
  }

  if (secretOrKeyPair instanceof Uint8Array) return

  // Test JWK key input
  {
    const [sKey, vKey] = await getJWKs(secretOrKeyPair, true, keys)
    const jws = await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(sKey)
    const verified = await lib.flattenedVerify(jws, vKey)
    t.deepEqual([...verified.payload], [...payload])
  }

  // Test JWK key input with all JWK properties
  {
    const [sKey, vKey] = await getJWKs(secretOrKeyPair, true, keys)
    const jws = await new lib.FlattenedSign(payload)
      .setProtectedHeader({ alg })
      .sign({ ...sKey, alg, use: 'sig', key_ops: ['sign'] })
    const verified = await lib.flattenedVerify(jws, {
      ...vKey,
      alg,
      use: 'sig',
      key_ops: ['verify'],
    })
    t.deepEqual([...verified.payload], [...payload])
  }
}

export async function jwt(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  secretOrKeyPair: keyType,
) {
  // Test Uint8Array, CryptoKey, and KeyObject key inputs
  {
    const [sKey, vKey] = await getJWKs(secretOrKeyPair, false, keys)
    const jwt = await new lib.SignJWT({ foo: 'bar' }).setProtectedHeader({ alg }).sign(sKey)
    {
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
    {
      const verified = await lib.jwtVerify(jwt, async () => vKey)
      t.deepEqual(verified, {
        key: vKey,
        payload: {
          foo: 'bar',
        },
        protectedHeader: { alg },
      })
    }
  }

  if (secretOrKeyPair instanceof Uint8Array) return

  // Test JWK key input
  {
    const [sKey, vKey] = await getJWKs(secretOrKeyPair, true, keys)
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
}
