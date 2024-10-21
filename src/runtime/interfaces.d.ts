import type { JWK, CryptoKey } from '../types.d.ts'
import type { PEMImportOptions } from '../key/import.js'

export interface TimingSafeEqual {
  (a: Uint8Array, b: Uint8Array): boolean
}
export interface Pbes2KWEncryptFunction {
  (
    alg: string,
    key: unknown,
    cek: Uint8Array,
    p2c?: number,
    p2s?: Uint8Array,
  ): Promise<{
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
  (
    enc: string,
    plaintext: Uint8Array,
    cek: unknown,
    iv: Uint8Array | undefined,
    aad: Uint8Array,
  ): Promise<{
    ciphertext: Uint8Array
    tag: Uint8Array | undefined
    iv: Uint8Array | undefined
  }>
}
export interface DecryptFunction {
  (
    enc: string,
    cek: unknown,
    ciphertext: Uint8Array,
    iv: Uint8Array | undefined,
    tag: Uint8Array | undefined,
    additionalData: Uint8Array,
  ): Promise<Uint8Array>
}
export interface FetchFunction {
  (url: URL, timeout: number, options?: any): Promise<{ [propName: string]: unknown }>
}
export interface DigestFunction {
  (digest: 'sha256' | 'sha384' | 'sha512', data: Uint8Array): Promise<Uint8Array>
}
export interface PEMImportFunction {
  (pem: string, alg: string, options?: PEMImportOptions): Promise<CryptoKey>
}
interface ExportFunction<T> {
  (key: unknown): Promise<T>
}
export type JWKExportFunction = ExportFunction<JWK>
export type PEMExportFunction = ExportFunction<string>
