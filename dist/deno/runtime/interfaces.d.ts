import type { JWK, KeyLike } from '../types.d.ts'
import type { PEMImportOptions } from '../key/import.ts'

type AsyncOrSync<T> = Promise<T> | T

export interface TimingSafeEqual {
  (a: Uint8Array, b: Uint8Array): boolean
}
export interface SignFunction {
  (alg: string, key: unknown, data: Uint8Array): Promise<Uint8Array>
}
export interface VerifyFunction {
  (alg: string, key: unknown, signature: Uint8Array, data: Uint8Array): Promise<boolean>
}
export interface AesKwWrapFunction {
  (alg: string, key: unknown, cek: Uint8Array): AsyncOrSync<Uint8Array>
}
export interface AesKwUnwrapFunction {
  (alg: string, key: unknown, encryptedKey: Uint8Array): AsyncOrSync<Uint8Array>
}
export interface RsaEsEncryptFunction {
  (alg: string, key: unknown, cek: Uint8Array): AsyncOrSync<Uint8Array>
}
export interface RsaEsDecryptFunction {
  (alg: string, key: unknown, encryptedKey: Uint8Array): AsyncOrSync<Uint8Array>
}
export interface Pbes2KWEncryptFunction {
  (alg: string, key: unknown, cek: Uint8Array, p2c?: number, p2s?: Uint8Array): Promise<{
    encryptedKey: Uint8Array
    p2c: number
    p2s: string
  }>
}
export interface Pbes2KWDecryptFunction {
  (
    alg: string,
    key: unknown,
    encryptedKey: Uint8Array,
    p2c: number,
    p2s: Uint8Array,
  ): Promise<Uint8Array>
}
export interface EncryptFunction {
  (enc: string, plaintext: Uint8Array, cek: unknown, iv: Uint8Array, aad: Uint8Array): AsyncOrSync<{
    ciphertext: Uint8Array
    tag: Uint8Array
  }>
}
export interface DecryptFunction {
  (
    enc: string,
    cek: unknown,
    ciphertext: Uint8Array,
    iv: Uint8Array,
    tag: Uint8Array,
    additionalData: Uint8Array,
  ): AsyncOrSync<Uint8Array>
}
export interface FetchFunction {
  (url: URL, timeout: number, options?: any): Promise<{ [propName: string]: unknown }>
}
export interface DigestFunction {
  (digest: 'sha256' | 'sha384' | 'sha512', data: Uint8Array): AsyncOrSync<Uint8Array>
}
export interface JWKImportFunction {
  (jwk: JWK): AsyncOrSync<KeyLike>
}
export interface PEMImportFunction {
  (pem: string, alg: string, options?: PEMImportOptions): AsyncOrSync<KeyLike>
}
interface ExportFunction<T> {
  (key: unknown): AsyncOrSync<T>
}
export type JWKExportFunction = ExportFunction<JWK>
export type PEMExportFunction = ExportFunction<string>
