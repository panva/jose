import * as HPKE from '@panva/hpke'
import type * as types from '../types.d.ts'
import { encoder, concat } from './buffer_utils.js'
import { checkEncCryptoKey } from './crypto_key.js'

interface SealResult {
  enc: Uint8Array
  ct: Uint8Array
}

export async function Seal(
  alg: string,
  pkR: types.CryptoKey,
  info: Uint8Array,
  aad: Uint8Array,
  pt: Uint8Array,
  psk?: Uint8Array,
  psk_id?: Uint8Array,
): Promise<SealResult> {
  checkEncCryptoKey(pkR, alg)
  const suite = getSuite(alg)

  const { encapsulatedSecret, ciphertext } = await suite.Seal(pkR, pt, {
    aad,
    info,
    psk,
    pskId: psk_id,
  })

  return { enc: encapsulatedSecret, ct: ciphertext }
}

export async function Open(
  alg: string,
  enc: Uint8Array,
  skR: types.CryptoKey,
  info: Uint8Array,
  aad: Uint8Array,
  ct: Uint8Array,
  psk?: Uint8Array,
  psk_id?: Uint8Array,
): Promise<Uint8Array> {
  checkEncCryptoKey(skR, alg, 'deriveBits')
  const suite = getSuite(alg)

  const pt = await suite.Open(skR, enc, ct, { aad, info, psk, pskId: psk_id })

  return pt
}

let HPKE0: HPKE.CipherSuite,
  HPKE1: HPKE.CipherSuite,
  HPKE2: HPKE.CipherSuite,
  HPKE3: HPKE.CipherSuite,
  HPKE4: HPKE.CipherSuite,
  HPKE7: HPKE.CipherSuite

export function getSuite(alg: string): HPKE.CipherSuite {
  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-0-KE':
      HPKE0 ||= new HPKE.CipherSuite(
        HPKE.KEM_DHKEM_P256_HKDF_SHA256,
        HPKE.KDF_HKDF_SHA256,
        HPKE.AEAD_AES_128_GCM,
      )
      return HPKE0
    case 'HPKE-1':
    case 'HPKE-1-KE':
      HPKE1 ||= new HPKE.CipherSuite(
        HPKE.KEM_DHKEM_P384_HKDF_SHA384,
        HPKE.KDF_HKDF_SHA384,
        HPKE.AEAD_AES_256_GCM,
      )
      return HPKE1
    case 'HPKE-2':
    case 'HPKE-2-KE':
      HPKE2 ||= new HPKE.CipherSuite(
        HPKE.KEM_DHKEM_P521_HKDF_SHA512,
        HPKE.KDF_HKDF_SHA512,
        HPKE.AEAD_AES_256_GCM,
      )
      return HPKE2
    case 'HPKE-3':
    case 'HPKE-3-KE':
      HPKE3 ||= new HPKE.CipherSuite(
        HPKE.KEM_DHKEM_X25519_HKDF_SHA256,
        HPKE.KDF_HKDF_SHA256,
        HPKE.AEAD_AES_128_GCM,
      )
      return HPKE3
    case 'HPKE-4':
    case 'HPKE-4-KE':
      HPKE4 ||= new HPKE.CipherSuite(
        HPKE.KEM_DHKEM_X25519_HKDF_SHA256,
        HPKE.KDF_HKDF_SHA256,
        HPKE.AEAD_ChaCha20Poly1305,
      )
      return HPKE4
    case 'HPKE-7':
    case 'HPKE-7-KE':
      HPKE7 ||= new HPKE.CipherSuite(
        HPKE.KEM_DHKEM_P256_HKDF_SHA256,
        HPKE.KDF_HKDF_SHA256,
        HPKE.AEAD_AES_256_GCM,
      )
      return HPKE7
    default:
      throw new Error('unreachable')
  }
}

export function isIntegratedEncryption(alg: string) {
  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-1':
    case 'HPKE-2':
    case 'HPKE-3':
    case 'HPKE-4':
    case 'HPKE-7':
      return true
    default:
      return false
  }
}

export function info(enc: string) {
  // Recipient_structure
  const separator = Uint8Array.of(0xff)
  return concat(
    encoder.encode('JOSE-HPKE rcpt'),
    separator,
    encoder.encode(enc),
    separator,
    new Uint8Array(),
  )
}
