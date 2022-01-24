/**
 * KeyLike are runtime-specific classes representing asymmetric keys or symmetric secrets.
 * These are instances of
 * [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) and additionally
 * [KeyObject](https://nodejs.org/api/crypto.html#crypto_class_keyobject)
 * in Node.js runtime.
 * [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
 * instances are also accepted as symmetric secret representation only.
 *
 * [Key Import Functions](../modules/key_import.md#readme) can be used to import PEM,
 * or JWK formatted asymmetric keys and certificates to these runtime-specific representations.
 *
 * In Node.js the
 * [Buffer](https://nodejs.org/api/buffer.html#buffer_buffer) class is a subclass of Uint8Array
 * and so Buffer can be provided for symmetric secrets as well.
 *
 * ---
 *
 * [KeyObject](https://nodejs.org/api/crypto.html#crypto_class_keyobject) is a representation of a
 * key/secret available in the Node.js runtime.
 * In addition to the import functions of this library you may use the
 * runtime APIs
 * [crypto.createPublicKey](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key),
 * [crypto.createPrivateKey](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key), and
 * [crypto.createSecretKey](https://nodejs.org/api/crypto.html#crypto_crypto_createsecretkey_key_encoding)
 * to obtain a KeyObject from your existing key material.
 *
 * [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) is a representation of a
 * key/secret available in the Browser and Deno runtimes.
 * In addition to the import functions of this library you may use the
 * [SubtleCrypto.importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey) API
 * to obtain a CryptoKey from your existing key material.
 *
 * ---
 *
 * @example Import a PEM-encoded SPKI Public Key
 * ```js
 * const algorithm = 'ES256'
 * const spki = `-----BEGIN PUBLIC KEY-----
 * MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
 * YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
 * -----END PUBLIC KEY-----`
 * const ecPublicKey = await jose.importSPKI(spki, algorithm)
 * ```
 *
 * @example Import a X.509 Certificate
 * ```js
 * const algorithm = 'ES256'
 * const x509 = `-----BEGIN CERTIFICATE-----
 * MIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np
 * QXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw
 * OTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN
 * VWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI
 * KoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35
 * UH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA
 * 1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh
 * v+A1QWZMuTWqYt+uh/YSRNDn
 * -----END CERTIFICATE-----`
 * const ecPublicKey = await jose.importX509(x509, algorithm)
 * ```
 *
 * @example Import a PEM-encoded PKCS8 Private Key
 * ```js
 * const algorithm = 'ES256'
 * const pkcs8 = `-----BEGIN PRIVATE KEY-----
 * MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
 * nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
 * l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
 * -----END PRIVATE KEY-----`
 * const ecPrivateKey = await jose.importPKCS8(pkcs8, algorithm)
 * ```
 *
 * @example Import a JSON Web Key (JWK)
 * ```js
 * const ecPublicKey = await jose.importJWK({
 *   crv: 'P-256',
 *   kty: 'EC',
 *   x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *   y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
 * }, 'ES256')
 *
 * const rsaPublicKey = await jose.importJWK({
 *   kty: 'RSA',
 *   e: 'AQAB',
 *   n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
 * }, 'PS256')
 * ```
 */
export type KeyLike = { type: string }
export interface JWK {
  alg?: string
  crv?: string
  d?: string
  dp?: string
  dq?: string
  e?: string
  ext?: boolean
  k?: string
  key_ops?: string[]
  kid?: string
  kty?: string
  n?: string
  oth?: Array<{
    d?: string
    r?: string
    t?: string
  }>
  p?: string
  q?: string
  qi?: string
  use?: string
  x?: string
  y?: string
  x5c?: string[]
  x5t?: string
  'x5t#S256'?: string
  x5u?: string
  [propName: string]: unknown
}
export interface GetKeyFunction<T, T2> {
  (protectedHeader: T, token: T2): Promise<KeyLike | Uint8Array>
}
export interface FlattenedJWSInput {
  header?: JWSHeaderParameters
  payload: string | Uint8Array
  protected?: string
  signature: string
}
export interface GeneralJWSInput {
  payload: string | Uint8Array
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}
export interface FlattenedJWS extends Partial<FlattenedJWSInput> {
  payload: string
  signature: string
}
export interface GeneralJWS {
  payload: string
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}
export interface JoseHeaderParameters {
  kid?: string
  x5t?: string
  x5c?: string[]
  x5u?: string
  jku?: string
  jwk?: Pick<JWK, 'kty' | 'crv' | 'x' | 'y' | 'e' | 'n'>
  typ?: string
  cty?: string
}
export interface JWSHeaderParameters extends JoseHeaderParameters {
  alg?: string
  b64?: boolean
  crit?: string[]
  [propName: string]: unknown
}
export interface JWEKeyManagementHeaderParameters {
  apu?: Uint8Array
  apv?: Uint8Array
  epk?: KeyLike
  iv?: Uint8Array
  p2c?: number
  p2s?: Uint8Array
}
export interface FlattenedJWE {
  aad?: string
  ciphertext: string
  encrypted_key?: string
  header?: JWEHeaderParameters
  iv: string
  protected?: string
  tag: string
  unprotected?: JWEHeaderParameters
}
export interface GeneralJWE extends Omit<FlattenedJWE, 'encrypted_key' | 'header'> {
  recipients: Pick<FlattenedJWE, 'encrypted_key' | 'header'>[]
}
export interface JWEHeaderParameters extends JoseHeaderParameters {
  alg?: string
  enc?: string
  crit?: string[]
  zip?: string
  [propName: string]: unknown
}
export interface CritOption {
  crit?: {
    [propName: string]: boolean
  }
}
export interface DecryptOptions extends CritOption {
  keyManagementAlgorithms?: string[]
  contentEncryptionAlgorithms?: string[]
  inflateRaw?: InflateFunction
}
export interface DeflateOption {
  deflateRaw?: DeflateFunction
}
export interface EncryptOptions extends CritOption, DeflateOption {}
export interface JWTClaimVerificationOptions {
  audience?: string | string[]
  clockTolerance?: string | number
  issuer?: string | string[]
  maxTokenAge?: string | number
  subject?: string
  typ?: string
  currentDate?: Date
}
export interface VerifyOptions extends CritOption {
  algorithms?: string[]
}
export interface SignOptions extends CritOption {}
export interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  jti?: string
  nbf?: number
  exp?: number
  iat?: number
  [propName: string]: unknown
}
export interface DeflateFunction {
  (input: Uint8Array): Promise<Uint8Array>
}
export interface InflateFunction {
  (input: Uint8Array): Promise<Uint8Array>
}
export interface FlattenedDecryptResult {
  additionalAuthenticatedData?: Uint8Array
  plaintext: Uint8Array
  protectedHeader?: JWEHeaderParameters
  sharedUnprotectedHeader?: JWEHeaderParameters
  unprotectedHeader?: JWEHeaderParameters
}
export interface GeneralDecryptResult extends FlattenedDecryptResult {}
export interface CompactDecryptResult {
  plaintext: Uint8Array
  protectedHeader: CompactJWEHeaderParameters
}
export interface FlattenedVerifyResult {
  payload: Uint8Array
  protectedHeader?: JWSHeaderParameters
  unprotectedHeader?: JWSHeaderParameters
}
export interface GeneralVerifyResult extends FlattenedVerifyResult {}
export interface CompactVerifyResult {
  payload: Uint8Array
  protectedHeader: CompactJWSHeaderParameters
}
export interface JWTVerifyResult {
  payload: JWTPayload
  protectedHeader: JWTHeaderParameters
}
export interface JWTDecryptResult {
  payload: JWTPayload
  protectedHeader: CompactJWEHeaderParameters
}
export interface ResolvedKey {
  key: KeyLike | Uint8Array
}
export interface CompactJWSHeaderParameters extends JWSHeaderParameters {
  alg: string
}
export interface JWTHeaderParameters extends CompactJWSHeaderParameters {
  b64?: true
}
export interface CompactJWEHeaderParameters extends JWEHeaderParameters {
  alg: string
  enc: string
}
export interface JSONWebKeySet {
  keys: JWK[]
}
