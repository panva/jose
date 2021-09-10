/// <reference lib="dom"/>
import type { KeyObject } from 'crypto'
export type { KeyObject }
export type KeyLike = KeyObject | CryptoKey | Uint8Array
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
  (protectedHeader: T, token: T2): Promise<KeyLike>
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
export interface EncryptOptions extends CritOption {
  deflateRaw?: DeflateFunction
}
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
  protectedHeader: JWEHeaderParameters
}
export interface FlattenedVerifyResult {
  payload: Uint8Array
  protectedHeader?: JWSHeaderParameters
  unprotectedHeader?: JWSHeaderParameters
}
export interface GeneralVerifyResult extends FlattenedVerifyResult {}
export interface CompactVerifyResult {
  payload: Uint8Array
  protectedHeader: JWSHeaderParameters
}
export interface JWTVerifyResult {
  payload: JWTPayload
  protectedHeader: JWSHeaderParameters
}
export interface JWTDecryptResult {
  payload: JWTPayload
  protectedHeader: JWEHeaderParameters
}
