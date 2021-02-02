import type { JWK, KeyLike } from '../types.d'
import type { EpkJwk, AsyncOrSync } from '../types.i.d'

export interface TimingSafeEqual {
  (a: Uint8Array, b: Uint8Array): boolean
}
export interface SignFunction {
  (alg: string, key: any, data: Uint8Array): Promise<Uint8Array>
}
export interface VerifyFunction {
  (alg: string, key: any, signature: Uint8Array, data: Uint8Array): Promise<boolean>
}
export interface AesKwWrapFunction {
  (alg: string, key: any, cek: Uint8Array): Promise<Uint8Array>
}
export interface AesKwUnwrapFunction {
  (alg: string, key: any, encryptedKey: Uint8Array): Promise<Uint8Array>
}
export interface RsaEsEncryptFunction {
  (alg: string, key: any, cek: Uint8Array): Promise<Uint8Array>
}
export interface RsaEsDecryptFunction {
  (alg: string, key: any, encryptedKey: Uint8Array): Promise<Uint8Array>
}
export interface AesGcmKwWrapFunction {
  (alg: string, key: any, cek: Uint8Array, iv?: Uint8Array): Promise<{
    encryptedKey: Uint8Array
    iv: string
    tag: string
  }>
}
export interface AesGcmKwUnwrapFunction {
  (
    alg: string,
    key: any,
    encryptedKey: Uint8Array,
    iv: Uint8Array,
    tag: Uint8Array,
  ): Promise<Uint8Array>
}
export interface Pbes2KWEncryptFunction {
  (alg: string, key: any, cek: Uint8Array, p2c?: number, p2s?: Uint8Array): Promise<{
    encryptedKey: Uint8Array
    p2c: number
    p2s: string
  }>
}
export interface Pbes2KWDecryptFunction {
  (
    alg: string,
    key: any,
    encryptedKey: Uint8Array,
    p2c: number,
    p2s: Uint8Array,
  ): Promise<Uint8Array>
}
export interface EcdhESDeriveKeyFunction {
  (
    publicKey: any,
    privateKey: any,
    enc: string,
    keyLength: number,
    apu?: Uint8Array,
    apv?: Uint8Array,
  ): Promise<Uint8Array>
}
export interface EcdhAllowedFunction {
  (key: any): boolean
}
export interface GenerateEpkFunction {
  (key: any): Promise<KeyLike>
}
export interface EphemeralKeyToPublicJwkFunction {
  (key: any): AsyncOrSync<EpkJwk>
}
export interface PublicJwkToEphemeralKeyFunction {
  (jwk: EpkJwk): AsyncOrSync<KeyLike>
}
export interface EncryptFunction {
  (enc: string, plaintext: Uint8Array, cek: any, iv: Uint8Array, aad: Uint8Array): Promise<{
    ciphertext: Uint8Array
    tag: Uint8Array
  }>
}
export interface DecryptFunction {
  (
    enc: string,
    cek: any,
    ciphertext: Uint8Array,
    iv: Uint8Array,
    tag: Uint8Array,
    additionalData: Uint8Array,
  ): Promise<Uint8Array>
}
export interface FetchFunction {
  (url: URL, timeout: number, options: any): Promise<any>
}
export interface DigestFunction {
  (digest: 'sha256' | 'sha384' | 'sha512', data: Uint8Array): AsyncOrSync<Uint8Array>
}
export interface JWKParseFunction {
  (jwk: JWK): AsyncOrSync<KeyLike>
}
export interface JWKConvertFunction {
  (key: any): AsyncOrSync<JWK>
}
