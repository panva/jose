/* eslint-disable @typescript-eslint/naming-convention */
import type { KeyObject } from 'crypto'

/**
 * JSON Web Key ([JWK](https://tools.ietf.org/html/rfc7517)).
 * "RSA", "EC", "OKP", and "oct" key types are supported.
 */
export interface JWK {
  /**
   * JWK "alg" (Algorithm) Parameter.
   */
  alg?: string
  crv?: string
  d?: string
  dp?: string
  dq?: string
  e?: string
  /**
   * JWK "ext" (Extractable) Parameter.
   */
  ext?: boolean
  k?: string
  /**
   * JWK "key_ops" (Key Operations) Parameter.
   */
  key_ops?: string[]
  /**
   * JWK "kid" (Key ID) Parameter.
   */
  kid?: string
  /**
   * JWK "kty" (Key Type) Parameter.
   */
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
  /**
   * JWK "use" (Public Key Use) Parameter.
   */
  use?: string
  x?: string
  y?: string
  /**
   * JWK "x5c" (X.509 Certificate Chain) Parameter.
   */
  x5c?: string[]
  /**
   * JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter.
   */
  x5t?: string
  /**
   * "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter.
   */
  'x5t#S256'?: string
  /**
   * JWK "x5u" (X.509 URL) Parameter.
   */
  x5u?: string
}

/**
 * Generic Interface for consuming operations dynamic key resolution.
 * No token components have been verified at the time of this function call.
 *
 * @param protectedHeader JWE or JWS Protected Header.
 * @param token The consumed JWE or JWS token.
 */
interface GetKeyFunction<T, T2> {
  (protectedHeader: T, token: T2): Promise<KeyLike>
}

/**
 * KeyLike are platform-specific references to keying material.
 *
 * - [KeyObject](https://nodejs.org/api/crypto.html#crypto_class_keyobject) instances come from
 * node's [crypto module](https://nodejs.org/api/crypto.html) (see crypto.generateKeyPair,
 * crypto.createPublicKey, crypto.createPrivateKey, crypto.createSecretKey).
 * - [CryptoKey](https://www.w3.org/TR/WebCryptoAPI) instances come from
 * [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI) (see SubtleCrypto.importKey,
 * SubtleCrypto.generateKey, SubtleCrypto.deriveKey, SubtleCrypto.unwrapKey).
 * - [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
 * is used exclusively for symmetric secret representations, a CryptoKey or KeyObject is
 * preferred, but in Web Crypto API this isn't an option for some algorithms.
 */
export type KeyLike = KeyObject | CryptoKey | Uint8Array

/**
 * Flattened JWS definition for verify function inputs, allows payload as
 * Uint8Array for detached signature validation.
 */
export interface FlattenedJWSInput {
  /**
   * The "header" member MUST be present and contain the value JWS
   * Unprotected Header when the JWS Unprotected Header value is non-
   * empty; otherwise, it MUST be absent.  This value is represented as
   * an unencoded JSON object, rather than as a string.  These Header
   * Parameter values are not integrity protected.
   */
  header?: JWSHeaderParameters

  /**
   * The "payload" member MUST be present and contain the value
   * BASE64URL(JWS Payload). When RFC7797 "b64": false is used
   * the value passed may also be a Uint8Array.
   */
  payload: string | Uint8Array

  /**
   * The "protected" member MUST be present and contain the value
   * BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
   * Header value is non-empty; otherwise, it MUST be absent.  These
   * Header Parameter values are integrity protected.
   */
  protected?: string

  /**
   * The "signature" member MUST be present and contain the value
   * BASE64URL(JWS Signature).
   */
  signature: string
}

/**
 * Flattened JWS definition. Payload is an optional return property, it
 * is not returned when JWS Unencoded Payload Option
 * [RFC7797](https://tools.ietf.org/html/rfc7797) is used.
 */
export interface FlattenedJWS extends Partial<FlattenedJWSInput> {
  payload?: string
  signature: string
}

export interface JoseHeaderParameters {
  /**
   * "kid" (Key ID) Header Parameter.
   */
  kid?: string

  /**
   * "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.
   */
  x5t?: string

  /**
   * "x5c" (X.509 Certificate Chain) Header Parameter.
   */
  x5c?: string[]

  /**
   * "x5u" (X.509 URL) Header Parameter.
   */
  x5u?: string

  /**
   * "jwk" (JSON Web Key) Header Parameter.
   */
  jwk?: Pick<JWK, 'kty' | 'crv' | 'x' | 'y' | 'e' | 'n'>

  /**
   * "typ" (Type) Header Parameter.
   */
  typ?: string

  /**
   * "cty" (Content Type) Header Parameter.
   */
  cty?: string
}

/**
 * Recognized JWS Header Parameters, any other Header Members
 * may also be present.
 */
export interface JWSHeaderParameters extends JoseHeaderParameters {
  /**
   * JWS "alg" (Algorithm) Header Parameter.
   */
  alg?: string

  /**
   * This JWS Extension Header Parameter modifies the JWS Payload
   * representation and the JWS Signing Input computation as per
   * [RFC7797](https://tools.ietf.org/html/rfc7797).
   */
  b64?: boolean

  /**
   * JWS "crit" (Critical) Header Parameter.
   */
  crit?: string[]

  /**
   * Any other JWS Header member.
   */
  [propName: string]: any
}

/**
 * Recognized JWE Key Management-related Header Parameters.
 */
export interface JWEKeyManagementHeaderParameters {
  apu?: Uint8Array
  apv?: Uint8Array
  epk?: KeyLike
  iv?: Uint8Array
  p2c?: number
  p2s?: Uint8Array
}

/**
 * Flattened JWE definition.
 */
export interface FlattenedJWE {
  /**
   * The "aad" member MUST be present and contain the value
   * BASE64URL(JWE AAD)) when the JWE AAD value is non-empty;
   * otherwise, it MUST be absent.  A JWE AAD value can be included to
   * supply a base64url-encoded value to be integrity protected but not
   * encrypted.
   */
  aad?: string

  /**
   * The "ciphertext" member MUST be present and contain the value
   * BASE64URL(JWE Ciphertext).
   */
  ciphertext: string

  /**
   * The "encrypted_key" member MUST be present and contain the value
   * BASE64URL(JWE Encrypted Key) when the JWE Encrypted Key value is
   * non-empty; otherwise, it MUST be absent.
   */
  encrypted_key?: string

  /**
   * The "header" member MUST be present and contain the value JWE Per-
   * Recipient Unprotected Header when the JWE Per-Recipient
   * Unprotected Header value is non-empty; otherwise, it MUST be
   * absent.  This value is represented as an unencoded JSON object,
   * rather than as a string.  These Header Parameter values are not
   * integrity protected.
   */
  header?: JWEHeaderParameters

  /**
   * The "iv" member MUST be present and contain the value
   * BASE64URL(JWE Initialization Vector) when the JWE Initialization
   * Vector value is non-empty; otherwise, it MUST be absent.
   */
  iv: string

  /**
   * The "protected" member MUST be present and contain the value
   * BASE64URL(UTF8(JWE Protected Header)) when the JWE Protected
   * Header value is non-empty; otherwise, it MUST be absent.  These
   * Header Parameter values are integrity protected.
   */
  protected?: string

  /**
   * The "tag" member MUST be present and contain the value
   * BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
   * value is non-empty; otherwise, it MUST be absent.
   */
  tag: string

  /**
   * The "unprotected" member MUST be present and contain the value JWE
   * Shared Unprotected Header when the JWE Shared Unprotected Header
   * value is non-empty; otherwise, it MUST be absent.  This value is
   * represented as an unencoded JSON object, rather than as a string.
   * These Header Parameter values are not integrity protected.
   */
  unprotected?: JWEHeaderParameters
}

/**
 * Recognized JWE Header Parameters, any other Header members
 * may also be present.
 */
export interface JWEHeaderParameters extends JoseHeaderParameters {
  /**
   * JWE "alg" (Algorithm) Header Parameter.
   */
  alg?: string

  /**
   * JWE "enc" (Encryption Algorithm) Header Parameter.
   */
  enc?: string

  /**
   * JWE "crit" (Critical) Header Parameter.
   */
  crit?: string[]

  /**
   * JWE "zip" (Compression Algorithm) Header Parameter.
   */
  zip?: string

  /**
   * Any other JWE Header member.
   */
  [propName: string]: any
}

/**
 * JWE Decryption options.
 */
export interface DecryptOptions {
  /**
   * A list of accepted JWE "alg" (Algorithm) Header Parameter values.
   */
  keyManagementAlgorithms?: string[]

  /**
   * A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.
   */
  contentEncryptionAlgorithms?: string[]

  /**
   * In a browser runtime you have to provide an implementation for Inflate Raw
   * when you expect JWEs with compressed plaintext.
   */
  inflateRaw?: InflateFunction
}

/**
 * JWE Encryption options.
 */
export interface EncryptOptions {
  /**
   * In a browser runtime you have to provide an implementation for Deflate Raw
   * when you will be producing JWEs with compressed plaintext.
   */
  deflateRaw?: DeflateFunction
}

/**
 * JWT Claims Set verification options.
 */
export interface JWTClaimVerificationOptions {
  /**
   * Expected JWT "aud" (Audience) Claim value(s).
   */
  audience?: string | string[]

  /**
   * Expected clock tolerance
   * - in seconds when number (e.g. 5)
   * - parsed as seconds when a string (e.g. "5 seconds").
   */
  clockTolerance?: string | number

  /**
   * Expected JWT "iss" (Issuer) Claim value(s).
   */
  issuer?: string | string[]

  /**
   * Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
   */
  maxTokenAge?: string

  /**
   * Expected JWT "sub" (Subject) Claim value.
   */
  subject?: string

  /**
   * Expected JWT "typ" (Type) Header Parameter value.
   */
  typ?: string

  /**
   * Date to use when comparing NumericDate claims, defaults to `new Date()`.
   */
  currentDate?: Date
}

/**
 * JWS Verification options.
 */
export interface VerifyOptions {
  /**
   * A list of accepted JWS "alg" (Algorithm) Header Parameter values.
   */
  algorithms?: string[]
}

/**
 * Recognized JWT Claims Set members, any other members
 * may also be present.
 */
export interface JWTPayload {
  /**
   * JWT Issuer - [RFC7519#section-4.1.1](https://tools.ietf.org/html/rfc7519#section-4.1.1).
   */
  iss?: string

  /**
   * JWT Subject - [RFC7519#section-4.1.2](https://tools.ietf.org/html/rfc7519#section-4.1.2).
   */
  sub?: string

  /**
   * JWT Audience [RFC7519#section-4.1.3](https://tools.ietf.org/html/rfc7519#section-4.1.3).
   */
  aud?: string | string[]

  /**
   * JWT ID - [RFC7519#section-4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7).
   */
  jti?: string

  /**
   * JWT Not Before - [RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).
   */
  nbf?: number

  /**
   * JWT Expiration Time - [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).
   */
  exp?: number

  /**
   * JWT Issued At - [RFC7519#section-4.1.6](https://tools.ietf.org/html/rfc7519#section-4.1.6).
   */
  iat?: number

  /**
   * Any other JWT Claim Set member.
   */
  [propName: string]: any
}

/**
 * Deflate Raw implementation, e.g. promisified [zlib.deflateRaw](https://nodejs.org/api/zlib.html#zlib_zlib_deflateraw_buffer_options_callback).
 */
export interface DeflateFunction {
  (input: Uint8Array): Promise<Uint8Array>
}

/**
 * Inflate Raw implementation, e.g. promisified [zlib.inflateRaw](https://nodejs.org/api/zlib.html#zlib_zlib_inflateraw_buffer_options_callback).
 */
export interface InflateFunction {
  (input: Uint8Array): Promise<Uint8Array>
}

export interface FlattenedDecryptResult {
  /**
   * JWE AAD.
   */
  additionalAuthenticatedData?: Uint8Array

  /**
   * Plaintext.
   */
  plaintext: Uint8Array

  /**
   * JWE Protected Header.
   */
  protectedHeader?: JWEHeaderParameters

  /**
   * JWE Shared Unprotected Header.
   */
  sharedUnprotectedHeader?: JWEHeaderParameters

  /**
   * JWE Per-Recipient Unprotected Header.
   */
  unprotectedHeader?: JWEHeaderParameters
}

export interface CompactDecryptResult {
  /**
   * Plaintext.
   */
  plaintext: Uint8Array

  /**
   * JWE Protected Header.
   */
  protectedHeader: JWEHeaderParameters
}

export interface FlattenedVerifyResult {
  /**
   * JWS Payload.
   */
  payload: Uint8Array

  /**
   * JWS Protected Header.
   */
  protectedHeader?: JWSHeaderParameters

  /**
   * JWS Unprotected Header.
   */
  unprotectedHeader?: JWSHeaderParameters
}

export interface CompactVerifyResult {
  /**
   * JWS Payload.
   */
  payload: Uint8Array

  /**
   * JWS Protected Header.
   */
  protectedHeader: JWSHeaderParameters
}

export interface JWTVerifyResult {
  /**
   * JWT Claims Set.
   */
  payload: JWTPayload

  /**
   * JWS Protected Header.
   */
  protectedHeader: JWSHeaderParameters
}

export interface JWTDecryptResult {
  /**
   * JWT Claims Set.
   */
  payload: JWTPayload

  /**
   * JWE Protected Header.
   */
  protectedHeader: JWEHeaderParameters
}
