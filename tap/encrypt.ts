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
  let dKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.privateKey : secretOrKeyPair
  let eKey = isKeyPair(secretOrKeyPair) ? secretOrKeyPair.publicKey : secretOrKeyPair

  if (jwk) {
    // @ts-ignore
    return [await keys.exportJWK(eKey), await keys.exportJWK(dKey)]
  }

  return [eKey, dKey]
}

function jwkWithProps(jwk: jose.JWK, alg: string, enc: string) {
  jwk = structuredClone(jwk)
  jwk.alg = alg === 'dir' ? enc : alg
  jwk.use = 'enc'
  if (jwk.k) {
    if (jwk.alg.match(/^A\d{3}KW$/)) {
      jwk.key_ops = ['wrapKey', 'unwrapKey']
    } else {
      jwk.key_ops = ['encrypt', 'decrypt']
    }
  } else if (jwk.kty === 'RSA') {
    if (jwk.d) {
      jwk.key_ops = ['unwrapKey', 'decrypt']
    } else {
      jwk.key_ops = ['wrapKey', 'encrypt']
    }
  } else if (jwk.kty === 'EC') {
    if (jwk.d) {
      jwk.key_ops = ['deriveBits']
    } else {
      jwk.key_ops = []
    }
  }

  return jwk
}

export async function jwe(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  enc: string,
  secretOrKeyPair: keyType,
  cleartext = crypto.getRandomValues(new Uint8Array(16)),
) {
  // Test Uint8Array, CryptoKey, and KeyObject key inputs
  {
    const [eKey, dKey] = await getKeys(secretOrKeyPair, false, keys)
    const aad = crypto.getRandomValues(new Uint8Array(16))

    const jwe = await new lib.FlattenedEncrypt(cleartext)
      .setProtectedHeader({ alg, enc })
      .setAdditionalAuthenticatedData(aad)
      .encrypt(eKey)

    for (const key of [dKey, async () => dKey]) {
      // @ts-ignore
      const decrypted = await lib.flattenedDecrypt(jwe, key, {
        keyManagementAlgorithms: [alg],
        contentEncryptionAlgorithms: [enc],
      })
      t.deepEqual([...decrypted.plaintext], [...cleartext])
      t.deepEqual([...decrypted.additionalAuthenticatedData!], [...aad])
    }
  }

  if (secretOrKeyPair instanceof Uint8Array) return

  // Test JWK key input
  {
    const [eKey, dKey] = await getKeys(secretOrKeyPair, true, keys)
    const aad = crypto.getRandomValues(new Uint8Array(16))

    const jwe = await new lib.FlattenedEncrypt(cleartext)
      .setProtectedHeader({ alg, enc })
      .setAdditionalAuthenticatedData(aad)
      .encrypt(eKey)

    {
      await new lib.FlattenedEncrypt(cleartext)
        .setProtectedHeader({ alg, enc })
        .setAdditionalAuthenticatedData(aad)
        .encrypt(jwkWithProps(eKey, alg, enc))
    }

    for (const key of [
      dKey,
      async () => dKey,
      jwkWithProps(dKey, alg, enc),
      async () => jwkWithProps(dKey, alg, enc),
    ]) {
      // @ts-ignore
      const decrypted = await lib.flattenedDecrypt(jwe, key, {
        keyManagementAlgorithms: [alg],
        contentEncryptionAlgorithms: [enc],
      })
      t.deepEqual([...decrypted.plaintext], [...cleartext])
      t.deepEqual([...decrypted.additionalAuthenticatedData!], [...aad])
    }
  }
}

export async function jwt(
  t: typeof QUnit.assert,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
  alg: string,
  enc: string,
  secretOrKeyPair: Uint8Array | jose.KeyLike | jose.GenerateKeyPairResult,
) {
  const [eKey, dKey] = await getKeys(secretOrKeyPair, false, keys)

  const jwt = await new lib.EncryptJWT({ foo: 'bar' })
    .setProtectedHeader({ alg, enc })
    .encrypt(eKey)

  for (const key of [dKey, async () => dKey]) {
    // @ts-ignore
    const decrypted = await lib.jwtDecrypt(jwt, key, {
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
}
