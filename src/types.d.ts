/**
 * KeyLike are runtime-specific classes representing asymmetric keys or symmetric secrets. These are
 * instances of [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) and
 * additionally [KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) in Node.js runtime.
 * [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
 * instances are also accepted as symmetric secret representation only.
 *
 * [Key Import Functions](../modules/key_import.md#readme) can be used to import PEM, or JWK
 * formatted asymmetric keys and certificates to these runtime-specific representations.
 *
 * In Node.js the [Buffer](https://nodejs.org/api/buffer.html#buffer) class is a subclass of
 * Uint8Array and so Buffer can be provided for symmetric secrets as well.
 *
 * [KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) is a representation of a
 * key/secret available in the Node.js runtime. In addition to the import functions of this library
 * you may use the runtime APIs
 * [crypto.createPublicKey](https://nodejs.org/api/crypto.html#cryptocreatepublickeykey),
 * [crypto.createPrivateKey](https://nodejs.org/api/crypto.html#cryptocreateprivatekeykey), and
 * [crypto.createSecretKey](https://nodejs.org/api/crypto.html#cryptocreatesecretkeykey-encoding) to
 * obtain a KeyObject from your existing key material.
 *
 * [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) is a representation of a
 * key/secret available in the Browser and Deno runtimes. In addition to the import functions of
 * this library you may use the
 * [SubtleCrypto.importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)
 * API to obtain a CryptoKey from your existing key material.
 *
 * @example Import a PEM-encoded SPKI Public Key
 *
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
 *
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
 *
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
 *
 * ```js
 * const ecPublicKey = await jose.importJWK(
 *   {
 *     crv: 'P-256',
 *     kty: 'EC',
 *     x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *     y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo',
 *   },
 *   'ES256',
 * )
 *
 * const rsaPublicKey = await jose.importJWK(
 *   {
 *     kty: 'RSA',
 *     e: 'AQAB',
 *     n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
 *   },
 *   'PS256',
 * )
 * ```
 */
export type KeyLike = { type: string }

/**
 * JSON Web Key ([JWK](https://www.rfc-editor.org/rfc/rfc7517)). "RSA", "EC", "OKP", and "oct" key
 * types are supported.
 */
export interface JWK {
  /** JWK "alg" (Algorithm) Parameter. */
  alg?: string
  crv?: string
  d?: string
  dp?: string
  dq?: string
  e?: string
  /** JWK "ext" (Extractable) Parameter. */
  ext?: boolean
  k?: string
  /** JWK "key_ops" (Key Operations) Parameter. */
  key_ops?: string[]
  /** JWK "kid" (Key ID) Parameter. */
  kid?: string
  /** JWK "kty" (Key Type) Parameter. */
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
  /** JWK "use" (Public Key Use) Parameter. */
  use?: string
  x?: string
  y?: string
  /** JWK "x5c" (X.509 Certificate Chain) Parameter. */
  x5c?: string[]
  /** JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter. */
  x5t?: string
  /** "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter. */
  'x5t#S256'?: string
  /** JWK "x5u" (X.509 URL) Parameter. */
  x5u?: string

  [propName: string]: unknown
}

/**
 * Generic Interface for consuming operations dynamic key resolution. No token components have been
 * verified at the time of this function call.
 *
 * If you cannot match a key suitable for the token, throw an error instead.
 *
 * @param protectedHeader JWE or JWS Protected Header.
 * @param token The consumed JWE or JWS token.
 */
export interface GetKeyFunction<T, T2> {
  (protectedHeader: T, token: T2): Promise<KeyLike | Uint8Array> | KeyLike | Uint8Array
}

/**
 * Flattened JWS definition for verify function inputs, allows payload as Uint8Array for detached
 * signature validation.
 */
export interface FlattenedJWSInput {
  /**
   * The "header" member MUST be present and contain the value JWS Unprotected Header when the JWS
   * Unprotected Header value is non- empty; otherwise, it MUST be absent. This value is represented
   * as an unencoded JSON object, rather than as a string. These Header Parameter values are not
   * integrity protected.
   */
  header?: JWSHeaderParameters

  /**
   * The "payload" member MUST be present and contain the value BASE64URL(JWS Payload). When RFC7797
   * "b64": false is used the value passed may also be a Uint8Array.
   */
  payload: string | Uint8Array

  /**
   * The "protected" member MUST be present and contain the value BASE64URL(UTF8(JWS Protected
   * Header)) when the JWS Protected Header value is non-empty; otherwise, it MUST be absent. These
   * Header Parameter values are integrity protected.
   */
  protected?: string

  /** The "signature" member MUST be present and contain the value BASE64URL(JWS Signature). */
  signature: string
}

/**
 * General JWS definition for verify function inputs, allows payload as Uint8Array for detached
 * signature validation.
 */
export interface GeneralJWSInput {
  /**
   * The "payload" member MUST be present and contain the value BASE64URL(JWS Payload). When RFC7797
   * "b64": false is used the value passed may also be a Uint8Array.
   */
  payload: string | Uint8Array

  /**
   * The "signatures" member value MUST be an array of JSON objects. Each object represents a
   * signature or MAC over the JWS Payload and the JWS Protected Header.
   */
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}

/**
 * Flattened JWS definition. Payload is returned as an empty string when JWS Unencoded Payload
 * Option [RFC7797](https://www.rfc-editor.org/rfc/rfc7797) is used.
 */
export interface FlattenedJWS extends Partial<FlattenedJWSInput> {
  payload: string
  signature: string
}

/**
 * General JWS definition. Payload is returned as an empty string when JWS Unencoded Payload Option
 * [RFC7797](https://www.rfc-editor.org/rfc/rfc7797) is used.
 */
export interface GeneralJWS {
  payload: string
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}

export interface JoseHeaderParameters {
  /** "kid" (Key ID) Header Parameter. */
  kid?: string

  /** "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter. */
  x5t?: string

  /** "x5c" (X.509 Certificate Chain) Header Parameter. */
  x5c?: string[]

  /** "x5u" (X.509 URL) Header Parameter. */
  x5u?: string

  /** "jku" (JWK Set URL) Header Parameter. */
  jku?: string

  /** "jwk" (JSON Web Key) Header Parameter. */
  jwk?: Pick<JWK, 'kty' | 'crv' | 'x' | 'y' | 'e' | 'n'>

  /** "typ" (Type) Header Parameter. */
  typ?: string

  /** "cty" (Content Type) Header Parameter. */
  cty?: string
}

/** Recognized JWS Header Parameters, any other Header Members may also be present. */
export interface JWSHeaderParameters extends JoseHeaderParameters {
  /** JWS "alg" (Algorithm) Header Parameter. */
  alg?: string

  /**
   * This JWS Extension Header Parameter modifies the JWS Payload representation and the JWS Signing
   * Input computation as per [RFC7797](https://www.rfc-editor.org/rfc/rfc7797).
   */
  b64?: boolean

  /** JWS "crit" (Critical) Header Parameter. */
  crit?: string[]

  /** Any other JWS Header member. */
  [propName: string]: unknown
}

/** Recognized JWE Key Management-related Header Parameters. */
export interface JWEKeyManagementHeaderParameters {
  apu?: Uint8Array
  apv?: Uint8Array
  /**
   * @deprecated You should not use this parameter. It is only really intended for test and vector
   *   validation purposes.
   */
  p2c?: number
  /**
   * @deprecated You should not use this parameter. It is only really intended for test and vector
   *   validation purposes.
   */
  p2s?: Uint8Array
  /**
   * @deprecated You should not use this parameter. It is only really intended for test and vector
   *   validation purposes.
   */
  iv?: Uint8Array
  /**
   * @deprecated You should not use this parameter. It is only really intended for test and vector
   *   validation purposes.
   */
  epk?: KeyLike
}

/** Flattened JWE definition. */
export interface FlattenedJWE {
  /**
   * The "aad" member MUST be present and contain the value BASE64URL(JWE AAD)) when the JWE AAD
   * value is non-empty; otherwise, it MUST be absent. A JWE AAD value can be included to supply a
   * base64url-encoded value to be integrity protected but not encrypted.
   */
  aad?: string

  /** The "ciphertext" member MUST be present and contain the value BASE64URL(JWE Ciphertext). */
  ciphertext: string

  /**
   * The "encrypted_key" member MUST be present and contain the value BASE64URL(JWE Encrypted Key)
   * when the JWE Encrypted Key value is non-empty; otherwise, it MUST be absent.
   */
  encrypted_key?: string

  /**
   * The "header" member MUST be present and contain the value JWE Per- Recipient Unprotected Header
   * when the JWE Per-Recipient Unprotected Header value is non-empty; otherwise, it MUST be absent.
   * This value is represented as an unencoded JSON object, rather than as a string. These Header
   * Parameter values are not integrity protected.
   */
  header?: JWEHeaderParameters

  /**
   * The "iv" member MUST be present and contain the value BASE64URL(JWE Initialization Vector) when
   * the JWE Initialization Vector value is non-empty; otherwise, it MUST be absent.
   */
  iv: string

  /**
   * The "protected" member MUST be present and contain the value BASE64URL(UTF8(JWE Protected
   * Header)) when the JWE Protected Header value is non-empty; otherwise, it MUST be absent. These
   * Header Parameter values are integrity protected.
   */
  protected?: string

  /**
   * The "tag" member MUST be present and contain the value BASE64URL(JWE Authentication Tag) when
   * the JWE Authentication Tag value is non-empty; otherwise, it MUST be absent.
   */
  tag: string

  /**
   * The "unprotected" member MUST be present and contain the value JWE Shared Unprotected Header
   * when the JWE Shared Unprotected Header value is non-empty; otherwise, it MUST be absent. This
   * value is represented as an unencoded JSON object, rather than as a string. These Header
   * Parameter values are not integrity protected.
   */
  unprotected?: JWEHeaderParameters
}

export interface GeneralJWE extends Omit<FlattenedJWE, 'encrypted_key' | 'header'> {
  recipients: Pick<FlattenedJWE, 'encrypted_key' | 'header'>[]
}

/** Recognized JWE Header Parameters, any other Header members may also be present. */
export interface JWEHeaderParameters extends JoseHeaderParameters {
  /** JWE "alg" (Algorithm) Header Parameter. */
  alg?: string

  /** JWE "enc" (Encryption Algorithm) Header Parameter. */
  enc?: string

  /** JWE "crit" (Critical) Header Parameter. */
  crit?: string[]

  /** JWE "zip" (Compression Algorithm) Header Parameter. */
  zip?: string

  /** Any other JWE Header member. */
  [propName: string]: unknown
}

/** Shared Interface with a "crit" property for all sign, verify, encrypt and decrypt operations. */
export interface CritOption {
  /**
   * An object with keys representing recognized "crit" (Critical) Header Parameter names. The value
   * for those is either `true` or `false`. `true` when the Header Parameter MUST be integrity
   * protected, `false` when it's irrelevant.
   *
   * This makes the "Extension Header Parameter "${parameter}" is not recognized" error go away.
   *
   * Use this when a given JWS/JWT/JWE profile requires the use of proprietary non-registered "crit"
   * (Critical) Header Parameters. This will only make sure the Header Parameter is syntactically
   * correct when provided and that it is optionally integrity protected. It will not process the
   * Header Parameter in any way or reject the operation if it is missing. You MUST still verify the
   * Header Parameter was present and process it according to the profile's validation steps after
   * the operation succeeds.
   *
   * The JWS extension Header Parameter `b64` is always recognized and processed properly. No other
   * registered Header Parameters that need this kind of default built-in treatment are currently available.
   */
  crit?: {
    [propName: string]: boolean
  }
}

/** JWE Decryption options. */
export interface DecryptOptions extends CritOption {
  /** A list of accepted JWE "alg" (Algorithm) Header Parameter values. */
  keyManagementAlgorithms?: string[]

  /**
   * A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values. By default all
   * "enc" (Encryption Algorithm) values applicable for the used key/secret are allowed.
   */
  contentEncryptionAlgorithms?: string[]

  /**
   * In a browser runtime you have to provide an implementation for Inflate Raw when you expect JWEs
   * with compressed plaintext.
   */
  inflateRaw?: InflateFunction
}

/** JWE Deflate option. */
export interface DeflateOption {
  /**
   * In a browser runtime you have to provide an implementation for Deflate Raw when you will be
   * producing JWEs with compressed plaintext.
   */
  deflateRaw?: DeflateFunction
}

/** JWE Encryption options. */
export interface EncryptOptions extends CritOption, DeflateOption {}

/** JWT Claims Set verification options. */
export interface JWTClaimVerificationOptions {
  /** Expected JWT "aud" (Audience) Claim value(s). */
  audience?: string | string[]

  /**
   * Expected clock tolerance
   *
   * - In seconds when number (e.g. 5)
   * - Parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").
   */
  clockTolerance?: string | number

  /** Expected JWT "iss" (Issuer) Claim value(s). */
  issuer?: string | string[]

  /**
   * Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
   *
   * - In seconds when number (e.g. 5)
   * - Parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").
   */
  maxTokenAge?: string | number

  /** Expected JWT "sub" (Subject) Claim value. */
  subject?: string

  /** Expected JWT "typ" (Type) Header Parameter value. */
  typ?: string

  /** Date to use when comparing NumericDate claims, defaults to `new Date()`. */
  currentDate?: Date
}

/** JWS Verification options. */
export interface VerifyOptions extends CritOption {
  /**
   * A list of accepted JWS "alg" (Algorithm) Header Parameter values. By default all "alg"
   * (Algorithm) values applicable for the used key/secret are allowed. Note: "none" is never accepted.
   */
  algorithms?: string[]
}

/** JWS Signing options. */
export interface SignOptions extends CritOption {}

/** Recognized JWT Claims Set members, any other members may also be present. */
export interface JWTPayload {
  /** JWT Issuer - [RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1). */
  iss?: string

  /** JWT Subject - [RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2). */
  sub?: string

  /** JWT Audience [RFC7519#section-4.1.3](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3). */
  aud?: string | string[]

  /** JWT ID - [RFC7519#section-4.1.7](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7). */
  jti?: string

  /** JWT Not Before - [RFC7519#section-4.1.5](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5). */
  nbf?: number

  /** JWT Expiration Time - [RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4). */
  exp?: number

  /** JWT Issued At - [RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6). */
  iat?: number

  /** Any other JWT Claim Set member. */
  [propName: string]: unknown
}

/**
 * Deflate Raw implementation, e.g. promisified
 * [zlib.deflateRaw](https://nodejs.org/api/zlib.html#zlibdeflaterawbuffer-options-callback).
 */
export interface DeflateFunction {
  (input: Uint8Array): Promise<Uint8Array>
}

/**
 * Inflate Raw implementation, e.g. promisified
 * [zlib.inflateRaw](https://nodejs.org/api/zlib.html#zlibinflaterawbuffer-options-callback).
 */
export interface InflateFunction {
  (input: Uint8Array): Promise<Uint8Array>
}

export interface FlattenedDecryptResult {
  /** JWE AAD. */
  additionalAuthenticatedData?: Uint8Array

  /** Plaintext. */
  plaintext: Uint8Array

  /** JWE Protected Header. */
  protectedHeader?: JWEHeaderParameters

  /** JWE Shared Unprotected Header. */
  sharedUnprotectedHeader?: JWEHeaderParameters

  /** JWE Per-Recipient Unprotected Header. */
  unprotectedHeader?: JWEHeaderParameters
}

export interface GeneralDecryptResult extends FlattenedDecryptResult {}

export interface CompactDecryptResult {
  /** Plaintext. */
  plaintext: Uint8Array

  /** JWE Protected Header. */
  protectedHeader: CompactJWEHeaderParameters
}

export interface FlattenedVerifyResult {
  /** JWS Payload. */
  payload: Uint8Array

  /** JWS Protected Header. */
  protectedHeader?: JWSHeaderParameters

  /** JWS Unprotected Header. */
  unprotectedHeader?: JWSHeaderParameters
}

export interface GeneralVerifyResult extends FlattenedVerifyResult {}

export interface CompactVerifyResult {
  /** JWS Payload. */
  payload: Uint8Array

  /** JWS Protected Header. */
  protectedHeader: CompactJWSHeaderParameters
}

export interface JWTVerifyResult {
  /** JWT Claims Set. */
  payload: JWTPayload

  /** JWS Protected Header. */
  protectedHeader: JWTHeaderParameters
}

export interface JWTDecryptResult {
  /** JWT Claims Set. */
  payload: JWTPayload

  /** JWE Protected Header. */
  protectedHeader: CompactJWEHeaderParameters
}

export interface ResolvedKey {
  /** Key resolved from the key resolver function. */
  key: KeyLike | Uint8Array
}

/** Recognized Compact JWS Header Parameters, any other Header Members may also be present. */
export interface CompactJWSHeaderParameters extends JWSHeaderParameters {
  alg: string
}

/** Recognized Signed JWT Header Parameters, any other Header Members may also be present. */
export interface JWTHeaderParameters extends CompactJWSHeaderParameters {
  b64?: true
}

/** Recognized Compact JWE Header Parameters, any other Header Members may also be present. */
export interface CompactJWEHeaderParameters extends JWEHeaderParameters {
  alg: string
  enc: string
}

/** JSON Web Key Set */
export interface JSONWebKeySet {
  keys: JWK[]
}
