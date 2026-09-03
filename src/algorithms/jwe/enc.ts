/** Tree-shakeable JWE content-encryption algorithm capability factories. @module */

import type * as types from '../../types.d.ts'

import { createAlgorithmFactory as create } from '../../lib/algorithm_capability.js'
import { concat, uint64be } from '../../lib/buffer_utils.js'
import { invalidKeyInput } from '../../lib/invalid_key_input.js'
import {
  A128CBC_HS256Key,
  A128GCMKey,
  A192CBC_HS384Key,
  A192GCMKey,
  A256CBC_HS512Key,
  A256GCMKey,
  type KeyRecipe,
} from '../../lib/key_algorithm.js'
import { decryptGCM, encryptGCM } from '../../lib/jwe_aes_gcm.js'
import { JWEDecryptionFailed } from '../../util/errors.js'
import type { JWEContentEncryptionCapability } from '../../lib/jwe_algorithm.js'

import type { JWEContentEncryptionAlgorithmName, JWEContentEncryptionFactory } from '../types.js'

function factory<Algorithm extends JWEContentEncryptionAlgorithmName>(
  algorithm: Algorithm,
  key: Readonly<KeyRecipe>,
  cekBits: number,
  ivBits: number,
  tagBits: number | undefined,
  encrypt: JWEContentEncryptionCapability['encrypt'],
  decrypt: JWEContentEncryptionCapability['decrypt'],
): JWEContentEncryptionFactory<Algorithm> {
  return create(
    {
      category: 'jwe-content-encryption',
      algorithm,
      key,
      cekBits,
      ivBits,
      tagBits,
      encrypt,
      decrypt,
    },
    2,
  ) as JWEContentEncryptionFactory<Algorithm>
}

async function setup(
  cek: Uint8Array | types.CryptoKey,
  keySize: number,
  usage: 'encrypt' | 'decrypt',
): Promise<[encKey: CryptoKey, macKey: CryptoKey]> {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalidKeyInput(cek, 'Uint8Array'))
  }
  const encKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(keySize >> 3) as Uint8Array<ArrayBuffer>,
    'AES-CBC',
    false,
    [usage],
  )
  const macKey = await crypto.subtle.importKey(
    'raw',
    cek.subarray(0, keySize >> 3) as Uint8Array<ArrayBuffer>,
    { hash: `SHA-${keySize << 1}`, name: 'HMAC' },
    false,
    ['sign'],
  )
  return [encKey, macKey]
}

async function tag(macKey: CryptoKey, data: Uint8Array, keySize: number): Promise<Uint8Array> {
  return new Uint8Array(
    (await crypto.subtle.sign('HMAC', macKey, data as Uint8Array<ArrayBuffer>)).slice(
      0,
      keySize >> 3,
    ),
  )
}

async function timingSafeEqual(a: Uint8Array, b: Uint8Array): Promise<boolean> {
  const algorithm = { name: 'HMAC', hash: 'SHA-256' }
  const key = (await crypto.subtle.generateKey(algorithm, false, ['sign', 'verify'])) as CryptoKey
  const aHmac = await crypto.subtle.sign(algorithm, key, a as Uint8Array<ArrayBuffer>)
  return crypto.subtle.verify(algorithm, key, aHmac, b as Uint8Array<ArrayBuffer>)
}

async function encryptCbcHmac(
  keySize: number,
  plaintext: Uint8Array,
  cek: Uint8Array | types.CryptoKey,
  iv: Uint8Array,
  aad: Uint8Array,
): Promise<{ ciphertext: Uint8Array; tag: Uint8Array; iv: Uint8Array }> {
  const [encKey, macKey] = await setup(cek, keySize, 'encrypt')
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { iv: iv as Uint8Array<ArrayBuffer>, name: 'AES-CBC' },
      encKey,
      plaintext as Uint8Array<ArrayBuffer>,
    ),
  )
  const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8))
  return { ciphertext, tag: await tag(macKey, macData, keySize), iv }
}

async function decryptCbcHmac(
  keySize: number,
  cek: Uint8Array | types.CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  actualTag: Uint8Array,
  aad: Uint8Array,
): Promise<Uint8Array> {
  const [encKey, macKey] = await setup(cek, keySize, 'decrypt')
  const macData = concat(aad, iv, ciphertext, uint64be(aad.length * 8))
  const expectedTag = await tag(macKey, macData, keySize)

  try {
    if (await timingSafeEqual(actualTag, expectedTag)) {
      return new Uint8Array(
        await crypto.subtle.decrypt(
          { iv: iv as Uint8Array<ArrayBuffer>, name: 'AES-CBC' },
          encKey,
          ciphertext as Uint8Array<ArrayBuffer>,
        ),
      )
    }
  } catch {
    // Fall through to the uniform decryption error.
  }
  throw new JWEDecryptionFailed()
}

function cbcHmac<Algorithm extends JWEContentEncryptionAlgorithmName>(
  key: KeyRecipe<Algorithm>,
  bits: number,
): JWEContentEncryptionFactory<Algorithm> {
  const keySize = bits >> 1
  return factory(
    key.alg,
    key,
    bits,
    128,
    undefined,
    encryptCbcHmac.bind(null, keySize),
    decryptCbcHmac.bind(null, keySize),
  )
}

function gcm<Algorithm extends JWEContentEncryptionAlgorithmName>(
  key: KeyRecipe<Algorithm>,
  bits: number,
): JWEContentEncryptionFactory<Algorithm> {
  return factory(
    key.alg,
    key,
    bits,
    96,
    128,
    encryptGCM.bind(null, key),
    decryptGCM.bind(null, key),
  )
}

/** The `A128GCM` JWE content-encryption algorithm capability factory. */
export const A128GCM: JWEContentEncryptionFactory<'A128GCM'> = /* @__PURE__ */ gcm(A128GCMKey, 128)

/** The `A192GCM` JWE content-encryption algorithm capability factory. */
export const A192GCM: JWEContentEncryptionFactory<'A192GCM'> = /* @__PURE__ */ gcm(A192GCMKey, 192)

/** The `A256GCM` JWE content-encryption algorithm capability factory. */
export const A256GCM: JWEContentEncryptionFactory<'A256GCM'> = /* @__PURE__ */ gcm(A256GCMKey, 256)

/** The `A128CBC-HS256` JWE content-encryption algorithm capability factory. */
export const A128CBC_HS256: JWEContentEncryptionFactory<'A128CBC-HS256'> = /* @__PURE__ */ cbcHmac(
  A128CBC_HS256Key,
  256,
)

/** The `A192CBC-HS384` JWE content-encryption algorithm capability factory. */
export const A192CBC_HS384: JWEContentEncryptionFactory<'A192CBC-HS384'> = /* @__PURE__ */ cbcHmac(
  A192CBC_HS384Key,
  384,
)

/** The `A256CBC-HS512` JWE content-encryption algorithm capability factory. */
export const A256CBC_HS512: JWEContentEncryptionFactory<'A256CBC-HS512'> = /* @__PURE__ */ cbcHmac(
  A256CBC_HS512Key,
  512,
)

export type {
  JWEContentEncryptionAlgorithmName,
  JWEContentEncryptionAlgorithmOf,
} from '../types.js'

/** Represents a factory for one built-in JWE content-encryption algorithm capability. */
export type { JWEContentEncryptionFactory } from '../types.js'
