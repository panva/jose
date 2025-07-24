import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

type keyType = Uint8Array | jose.CryptoKey | jose.KeyObject | jose.GenerateKeyPairResult

function isKeyPair(input: keyType): input is jose.GenerateKeyPairResult {
  return 'publicKey' in input && 'privateKey' in input
}

async function getKeys(
  secretOrKeyPair: keyType,
  jwk: false,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
): Promise<Array<Uint8Array | jose.CryptoKey | jose.KeyObject>>
async function getKeys(
  secretOrKeyPair: keyType,
  jwk: true,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
): Promise<Array<jose.JWK>>
async function getKeys(
  secretOrKeyPair: keyType,
  jwk: boolean,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) {
  let sKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  let vKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair

  if (jwk) {
    // @ts-ignore
    return [await keys.exportJWK(sKey), await keys.exportJWK(vKey)]
  }

  return [sKey, vKey]
}

function jwkWithProps(jwk: jose.JWK, alg: string) {
  jwk = structuredClone(jwk)
  jwk.alg = alg
  jwk.use = 'sig'
  if (jwk.k) {
    jwk.key_ops = ['sign', 'verify']
  } else if (jwk.d || jwk.priv) {
    jwk.key_ops = ['sign']
  } else {
    jwk.key_ops = ['verify']
  }

  return jwk
}

export async function jws(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  secretOrKeyPair: keyType,
  payload = crypto.getRandomValues(new Uint8Array(16)),
) {
  // Test Uint8Array, CryptoKey, and KeyObject key inputs
  {
    const [sKey, vKey] = await getKeys(secretOrKeyPair, false, keys)
    const jws = await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(sKey)
    {
      const verified = await lib.flattenedVerify(jws, vKey)
      t.deepEqual([...verified.payload], [...payload])
    }
    {
      const verified = await lib.flattenedVerify(jws, async () => vKey)
      t.propContains(verified, {
        key: vKey,
        payload,
        protectedHeader: { alg },
      })
    }
  }

  if (secretOrKeyPair instanceof Uint8Array) return

  // Test JWK key input
  {
    const [sKey, vKey] = await getKeys(secretOrKeyPair, true, keys)
    const jws = await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(sKey)
    await new lib.FlattenedSign(payload).setProtectedHeader({ alg }).sign(jwkWithProps(sKey, alg))
    for (const key of [
      vKey,
      async () => vKey,
      jwkWithProps(vKey, alg),
      async () => jwkWithProps(vKey, alg),
    ]) {
      // @ts-ignore
      const verified = await lib.flattenedVerify(jws, key)
      t.deepEqual([...verified.payload], [...payload])
    }
  }

  // Test JWK key input with all JWK properties
  {
    const [sKey, vKey] = await getKeys(secretOrKeyPair, true, keys)
    const jws = await new lib.FlattenedSign(payload)
      .setProtectedHeader({ alg })
      .sign(jwkWithProps(sKey, alg))
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
  const [sKey, vKey] = await getKeys(secretOrKeyPair, false, keys)
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
