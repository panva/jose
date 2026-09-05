/**
 * Supported JWS "alg" (Algorithm) Header Parameter values. Availability depends on the runtime.
 *
 * @ignore
 *
 * @see {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}
 */
export type JWSAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'EdDSA'
  | 'Ed25519'
  | 'ML-DSA-44'
  | 'ML-DSA-65'
  | 'ML-DSA-87'
  | (string & {})

/**
 * Supported JWE "alg" (Algorithm) Header Parameter values. Availability depends on the runtime.
 *
 * @ignore
 *
 * @see {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}
 */
export type JWEKeyManagementAlgorithm =
  | 'dir'
  | 'A128KW'
  | 'A192KW'
  | 'A256KW'
  | 'A128GCMKW'
  | 'A192GCMKW'
  | 'A256GCMKW'
  | 'ECDH-ES'
  | 'ECDH-ES+A128KW'
  | 'ECDH-ES+A192KW'
  | 'ECDH-ES+A256KW'
  | 'RSA-OAEP'
  | 'RSA-OAEP-256'
  | 'RSA-OAEP-384'
  | 'RSA-OAEP-512'
  | 'PBES2-HS256+A128KW'
  | 'PBES2-HS384+A192KW'
  | 'PBES2-HS512+A256KW'
  | (string & {})

/**
 * Supported JWE "enc" (Encryption Algorithm) Header Parameter values. Availability depends on the
 * runtime.
 *
 * @ignore
 */
export type JWEContentEncryptionAlgorithm =
  | 'A128CBC-HS256'
  | 'A192CBC-HS384'
  | 'A256CBC-HS512'
  | 'A128GCM'
  | 'A192GCM'
  | 'A256GCM'
  | (string & {})

/**
 * JWK "kty" (Key Type) Parameter values supported by this module.
 *
 * @ignore
 */
export type JWKKeyType = 'EC' | 'RSA' | 'OKP' | 'AKP' | 'oct' | (string & {})

/**
 * Generic JSON Web Key Parameters.
 *
 * > [!NOTE]\
 * > This is declared as a type alias rather than an interface so that it satisfies the implicit index
 * > signature of the `JsonWebKey` types shipped by `@types/node` and `lib.dom`.
 */
export type JWKParameters = {
  /** JWK "kty" (Key Type) Parameter */
  kty?: JWKKeyType
  /**
   * JWK "alg" (Algorithm) Parameter
   *
   * @see {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}
   */
  alg?: JWSAlgorithm | JWEKeyManagementAlgorithm | JWEContentEncryptionAlgorithm
  /** Permitted key operations. */
  key_ops?: string[]
  /** Whether the key may be exported. */
  ext?: boolean

  /** JWK "use" (Public Key Use) Parameter */
  use?: 'sig' | 'enc' | (string & {})
  /** X.509 certificate chain. */
  x5c?: string[]
  /** X.509 certificate SHA-1 thumbprint. */
  x5t?: string
  /** X.509 certificate SHA-256 thumbprint. */
  'x5t#S256'?: string
  /** X.509 certificate URL. */
  x5u?: string

  /** JWK "kid" (Key ID) Parameter */
  kid?: string
}

/** Convenience interface for public OKP JSON Web Keys. */
export interface JWK_OKP_Public extends JWKParameters {
  /** Key pair subtype. */
  crv: string
  /** Public key. */
  x: string
}

/** Convenience interface for private OKP JSON Web Keys. */
export interface JWK_OKP_Private extends JWK_OKP_Public {
  /** Private key. */
  d: string
}

/** Convenience interface for public AKP JSON Web Keys. */
export interface JWK_AKP_Public extends JWKParameters {
  /** JWK "alg" (Algorithm) Parameter */
  alg: string

  /** AKP JWK "pub" (The Public key) Parameter */
  pub: string
}

/** Convenience interface for private AKP JSON Web Keys. */
export interface JWK_AKP_Private extends JWK_AKP_Public {
  /** AKP JWK "priv" (The Private Key) Parameter */
  priv: string
}

/** Convenience interface for public EC JSON Web Keys. */
export interface JWK_EC_Public extends JWKParameters {
  /** Curve. */
  crv: string
  /** Public key X coordinate. */
  x: string
  /** Public key Y coordinate. */
  y: string
}

/** Convenience interface for private EC JSON Web Keys. */
export interface JWK_EC_Private extends JWK_EC_Public {
  /** Private key. */
  d: string
}

/** Convenience interface for public RSA JSON Web Keys. */
export interface JWK_RSA_Public extends JWKParameters {
  /** Public exponent. */
  e: string
  /** Modulus. */
  n: string
}

/** Convenience interface for private RSA JSON Web Keys. */
export interface JWK_RSA_Private extends JWK_RSA_Public {
  /** Private exponent. */
  d: string
  /** First factor CRT exponent. */
  dp: string
  /** Second factor CRT exponent. */
  dq: string
  /** First prime factor. */
  p: string
  /** Second prime factor. */
  q: string
  /** First CRT coefficient. */
  qi: string
}

/** Convenience interface for "oct" JSON Web Keys. */
export interface JWK_oct extends JWKParameters {
  /** Symmetric key value. */
  k: string
}

/**
 * JSON Web Key ({@link https://www.rfc-editor.org/info/rfc7517/ JWK}). "RSA", "EC", "OKP", "AKP",
 * and "oct" key types are supported.
 *
 * > [!NOTE]\
 * > This is declared as a type alias rather than an interface so that it satisfies the implicit index
 * > signature of the `JsonWebKey` types shipped by `@types/node` and `lib.dom`. It spells out the
 * > {@link JWKParameters} members rather than intersecting them so that every JWK member is documented
 * > in one place.
 *
 * @see {@link JWK_AKP_Public}
 * @see {@link JWK_AKP_Private}
 * @see {@link JWK_OKP_Public}
 * @see {@link JWK_OKP_Private}
 * @see {@link JWK_EC_Public}
 * @see {@link JWK_EC_Private}
 * @see {@link JWK_RSA_Public}
 * @see {@link JWK_RSA_Private}
 * @see {@link JWK_oct}
 * @see {@link AnyJWK} for a variant that can be narrowed on the "kty" (Key Type) Parameter.
 */
export type JWK = {
  /** JWK "kty" (Key Type) Parameter */
  kty?: JWKKeyType
  /**
   * JWK "alg" (Algorithm) Parameter
   *
   * @see {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}
   */
  alg?: JWSAlgorithm | JWEKeyManagementAlgorithm | JWEContentEncryptionAlgorithm
  /** Permitted key operations. */
  key_ops?: string[]
  /** Whether the key may be exported. */
  ext?: boolean

  /** JWK "use" (Public Key Use) Parameter */
  use?: 'sig' | 'enc' | (string & {})
  /** X.509 certificate chain. */
  x5c?: string[]
  /** X.509 certificate SHA-1 thumbprint. */
  x5t?: string
  /** X.509 certificate SHA-256 thumbprint. */
  'x5t#S256'?: string
  /** X.509 certificate URL. */
  x5u?: string

  /** JWK "kid" (Key ID) Parameter */
  kid?: string
  /** EC curve or OKP key pair subtype. */
  crv?: string
  /** Private RSA exponent, EC key, or OKP key. */
  d?: string
  /** RSA first factor CRT exponent. */
  dp?: string
  /** RSA second factor CRT exponent. */
  dq?: string
  /** RSA public exponent. */
  e?: string
  /** Symmetric key value. */
  k?: string
  /** RSA modulus. */
  n?: string
  /** RSA first prime factor. */
  p?: string
  /** RSA second prime factor. */
  q?: string
  /** RSA first CRT coefficient. */
  qi?: string
  /** EC public key X coordinate or OKP public key. */
  x?: string
  /** EC public key Y coordinate. */
  y?: string

  /** AKP JWK "pub" (Public Key) Parameter */
  pub?: string

  /** AKP JWK "priv" (Private key) Parameter */
  priv?: string
  /** Additional RSA prime factors. */
  oth?: Array<{
    /** Factor CRT exponent. */
    d?: string
    /** Prime factor. */
    r?: string
    /** Factor CRT coefficient. */
    t?: string
  }>
}

/**
 * Discriminated union of supported JSON Web Key shapes, narrowed by the "kty" (Key Type) Parameter.
 *
 * Unlike {@link JWK}, each member requires and fixes the "kty" (Key Type) Parameter to its key type
 * so that the union can be narrowed on it.
 *
 * @example
 *
 * ```ts
 * let jwk!: jose.AnyJWK
 *
 * if (jwk.kty === 'EC') {
 *   console.log(jwk.crv, jwk.x, jwk.y)
 * }
 * ```
 */
// Intersect "kty" into each member separately: typedoc omits the parentheses in `X & (A | B)`.
export type AnyJWK =
  | (JWK_EC_Private & { kty: 'EC' })
  | (JWK_EC_Public & { kty: 'EC' })
  | (JWK_RSA_Private & { kty: 'RSA' })
  | (JWK_RSA_Public & { kty: 'RSA' })
  | (JWK_OKP_Private & { kty: 'OKP' })
  | (JWK_OKP_Public & { kty: 'OKP' })
  | (JWK_AKP_Private & { kty: 'AKP' })
  | (JWK_AKP_Public & { kty: 'AKP' })
  | (JWK_oct & { kty: 'oct' })

/**
 * Key or secret input accepted by all sign, verify, encrypt, and decrypt operations.
 *
 * @see {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}
 */
export type KeyInput = CryptoKey | KeyObject | JWK | Uint8Array

/**
 * Dynamic key resolver for consuming operations.
 *
 * @typeParam IProtectedHeader Type definition of the JWE or JWS Protected Header.
 * @typeParam IToken Type definition of the consumed JWE or JWS token.
 * @typeParam KeyTypes Type definition of the keys the function may resolve. Narrowing this is what
 *   lets {@link ResolvedKey.key} be inferred at the call site.
 */
export interface GetKeyFunction<IProtectedHeader, IToken, KeyTypes extends KeyInput = KeyInput> {
  /**
   * Resolves a key for an unverified token. Throw if no suitable key can be resolved.
   *
   * @param protectedHeader JWE or JWS Protected Header.
   * @param token The consumed JWE or JWS token; none of its components have been verified.
   */
  (protectedHeader: IProtectedHeader, token: IToken): Promise<KeyTypes> | KeyTypes
}

/**
 * Flattened JWS verification input.
 *
 * The payload may be a {@link !Uint8Array} for detached signature validation.
 */
export interface FlattenedJWSInput {
  /** JWS Unprotected Header as a JSON object. Not integrity protected; omit when empty. */
  header?: JWSHeaderParameters

  /** Base64url-encoded payload; with `b64: false`, supply an unencoded string or Uint8Array. */
  payload: string | Uint8Array

  /** Base64url-encoded UTF-8 JWS Protected Header. Integrity protected; omit when empty. */
  protected?: string

  /** Base64url-encoded signature or MAC. */
  signature: string
}

/**
 * General JWS verification input.
 *
 * The payload may be a {@link !Uint8Array} for detached signature validation.
 */
export interface GeneralJWSInput {
  /** Base64url-encoded payload; with `b64: false`, supply an unencoded string or Uint8Array. */
  payload: string | Uint8Array

  /**
   * The "signatures" member value MUST be an array of JSON objects. Each object represents a
   * signature or MAC over the JWS Payload and the JWS Protected Header.
   */
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}

/**
 * Flattened JWS JSON Serialization token. The payload is an empty string when the
 * {@link https://www.rfc-editor.org/info/rfc7797/ unencoded payload option} is used.
 */
export interface FlattenedJWS extends Partial<FlattenedJWSInput> {
  payload: string
  signature: string
}

/**
 * General JWS JSON Serialization token. The payload is an empty string when the
 * {@link https://www.rfc-editor.org/info/rfc7797/ unencoded payload option} is used.
 */
export interface GeneralJWS {
  payload: string
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}

/** Header Parameters common to JWE and JWS. */
export interface JoseHeaderParameters {
  /** "kid" (Key ID) Header Parameter */
  kid?: string

  /** X.509 certificate SHA-1 thumbprint. */
  x5t?: string

  /** X.509 certificate chain. */
  x5c?: string[]

  /** X.509 certificate URL. */
  x5u?: string

  /** JWK Set URL. */
  jku?: string

  /** Public JWK only; private and symmetric key parameters are not permitted. */
  jwk?: Omit<JWK, 'd' | 'dp' | 'dq' | 'k' | 'p' | 'q' | 'qi' | 'priv' | 'oth'>

  /** "typ" (Type) Header Parameter */
  typ?: string

  /** Content type. */
  cty?: string
}

/** Recognized JWS Header Parameters; additional members may also be present. */
export interface JWSHeaderParameters extends JoseHeaderParameters {
  /**
   * JWS "alg" (Algorithm) Header Parameter
   *
   * @see {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}
   */
  alg?: JWSAlgorithm

  /**
   * Controls payload encoding and the JWS signing input as defined by
   * {@link https://www.rfc-editor.org/info/rfc7797/ RFC7797}. Set to `false` and list `b64` in
   * `crit` to use an unencoded payload.
   */
  b64?: boolean

  /** Extension parameters that must be recognized. */
  crit?: string[]

  /** Any other JWS Header member. */
  [propName: string]: unknown
}

/** Recognized JWE Key Management-related Header Parameters. */
export interface JWEKeyManagementHeaderParameters {
  /** ECDH-ES Agreement PartyUInfo bytes, used in ConcatKDF and added to the JOSE header. */
  apu?: Uint8Array

  /** ECDH-ES Agreement PartyVInfo bytes, used in ConcatKDF and added to the JOSE header. */
  apv?: Uint8Array

  /** PBES2 PBKDF2 iteration count, added to the JOSE header. */
  p2c?: number

  /** @deprecated For testing and vector validation only. */
  p2s?: Uint8Array
  /** @deprecated For testing and vector validation only. */
  iv?: Uint8Array
  /** @deprecated For testing and vector validation only. */
  epk?: CryptoKey | KeyObject
}

/** Flattened JWE JSON Serialization token. */
export interface FlattenedJWE {
  /**
   * Base64url-encoded additional authenticated data; integrity protected but not encrypted. Omit
   * when empty.
   */
  aad?: string

  /** Base64url-encoded ciphertext. */
  ciphertext: string

  /** Base64url-encoded encrypted key. Omit when empty. */
  encrypted_key?: string

  /**
   * JWE Per-Recipient Unprotected Header as a JSON object. Not integrity protected; omit when
   * empty.
   */
  header?: JWEHeaderParameters

  /** Base64url-encoded initialization vector. Omit when empty. */
  iv?: string

  /** Base64url-encoded UTF-8 JWE Protected Header. Integrity protected; omit when empty. */
  protected?: string

  /** Base64url-encoded authentication tag. Omit when empty. */
  tag?: string

  /** JWE Shared Unprotected Header as a JSON object. Not integrity protected; omit when empty. */
  unprotected?: JWEHeaderParameters
}

/** General JWE JSON Serialization token. */
export interface GeneralJWE extends Omit<FlattenedJWE, 'encrypted_key' | 'header'> {
  recipients: Pick<FlattenedJWE, 'encrypted_key' | 'header'>[]
}

/** Recognized JWE Header Parameters; additional members may also be present. */
export interface JWEHeaderParameters extends JoseHeaderParameters {
  /**
   * JWE "alg" (Algorithm) Header Parameter
   *
   * @see {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}
   */
  alg?: JWEKeyManagementAlgorithm

  /**
   * JWE "enc" (Encryption Algorithm) Header Parameter
   *
   * @see {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}
   */
  enc?: JWEContentEncryptionAlgorithm

  /** Extension parameters that must be recognized. */
  crit?: string[]

  /**
   * JWE compression algorithm. Only `"DEF"` (DEFLATE) is supported, requiring the runtime's
   * `CompressionStream` / `DecompressionStream` APIs.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7516/#section-4.1.3 JWE "zip" Header Parameter}
   */
  zip?: 'DEF' | (string & {})

  /** Any other JWE Header member. */
  [propName: string]: unknown
}

/** Shared "crit" option for signing, verification, encryption, and decryption. */
export interface CritOption {
  /**
   * Recognized "crit" (Critical) Header Parameter names. Set each value to `true` to require
   * integrity protection, or `false` when protection is optional. The JWS `b64` extension is always
   * recognized and processed.
   *
   * > [!WARNING]\
   * > Other extensions are only checked for syntax and optional integrity protection. Their presence
   * > is not required by this option. You must check their presence and process them according to the
   * > profile's validation steps after the operation succeeds.
   */
  crit?: {
    [propName: string]: boolean
  }
}

/** JWE Decryption options. */
export interface DecryptOptions extends CritOption {
  /**
   * Accepted JWE "alg" (Algorithm) Header Parameter values. Defaults to all algorithms applicable
   * to the key or secret except PBES2, which must be explicitly allowed.
   */
  keyManagementAlgorithms?: JWEKeyManagementAlgorithm[]

  /**
   * Accepted JWE "enc" (Encryption Algorithm) Header Parameter values. Defaults to all algorithms
   * applicable to the key or secret.
   */
  contentEncryptionAlgorithms?: JWEContentEncryptionAlgorithm[]

  /**
   * Maximum "p2c" (PBES2 Count) Header Parameter value, limiting PBKDF2 iterations and their
   * computational expense. Defaults to 10000; must be a positive safe integer or `Infinity` to
   * disable the limit.
   */
  maxPBES2Count?: number

  /**
   * Maximum decompressed plaintext size in bytes. Defaults to 250000; `0` rejects compressed JWEs,
   * and `Infinity` disables the limit. Other values must be positive safe integers.
   */
  maxDecompressedLength?: number
}

/** JWE Encryption options. */
export interface EncryptOptions extends CritOption {}

/** JWT Claims Set verification options. */
export interface JWTClaimVerificationOptions {
  /** Expected JWT "aud" (Audience) Claim value(s). Requires the claim to be present. */
  audience?: string | string[]

  /**
   * Clock skew tolerance in seconds or a duration string (e.g. "5 seconds"). Applies to the "nbf"
   * (Not Before) and "exp" (Expiration Time) claims, and to "iat" (Issued At) when
   * {@link maxTokenAge} is set.
   */
  clockTolerance?: string | number

  /** Expected JWT "iss" (Issuer) Claim value(s). Requires the claim to be present. */
  issuer?: string | string[]

  /**
   * Maximum time since the JWT "iat" (Issued At) Claim, in seconds or a duration string (e.g. "2
   * hours"). Requires the claim to be present.
   */
  maxTokenAge?: string | number

  /** Expected JWT "sub" (Subject) Claim value. Requires the claim to be present. */
  subject?: string

  /** Expected JWT "typ" (Type) Header Parameter value. Requires the parameter to be present. */
  typ?: string

  /** Date for NumericDate comparisons. Defaults to `new Date()`. */
  currentDate?: Date

  /**
   * Additional claim names required in the JWT Claims Set. The {@link issuer}, {@link audience},
   * {@link subject}, and {@link maxTokenAge} options independently require "iss", "aud", "sub", and
   * "iat", respectively.
   */
  requiredClaims?: string[]
}

/** JWS Verification options. */
export interface VerifyOptions extends CritOption {
  /**
   * Accepted JWS "alg" (Algorithm) Header Parameter values. Defaults to all algorithms applicable
   * to the key or secret. Unsecured JWTs (`alg: "none"`) are never accepted.
   */
  algorithms?: JWSAlgorithm[]
}

/** JWS Signing options. */
export interface SignOptions extends CritOption {}

/** Recognized JWT Claims Set members; additional members may also be present. */
export interface JWTPayload {
  /**
   * JWT Issuer
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.1 RFC7519#section-4.1.1}
   */
  iss?: string

  /**
   * JWT Subject
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.2 RFC7519#section-4.1.2}
   */
  sub?: string

  /**
   * JWT Audience
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.3 RFC7519#section-4.1.3}
   */
  aud?: string | string[]

  /**
   * JWT ID
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.7 RFC7519#section-4.1.7}
   */
  jti?: string

  /**
   * Not valid before this Unix timestamp in seconds.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.5 RFC7519#section-4.1.5}
   */
  nbf?: number

  /**
   * Expiration Unix timestamp in seconds.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.4 RFC7519#section-4.1.4}
   */
  exp?: number

  /**
   * Issued-at Unix timestamp in seconds.
   *
   * @see {@link https://www.rfc-editor.org/info/rfc7519/#section-4.1.6 RFC7519#section-4.1.6}
   */
  iat?: number

  /** Any other JWT Claim Set member. */
  [propName: string]: unknown
}

/** Flattened JWE JSON Serialization decryption result. */
export interface FlattenedDecryptResult {
  /** JWE Additional Authenticated Data, integrity protected but not encrypted. */
  additionalAuthenticatedData?: Uint8Array

  /** Plaintext. */
  plaintext: Uint8Array

  /** JWE Protected Header. */
  protectedHeader?: JWEHeaderParameters

  /** JWE Shared Unprotected Header. Not integrity protected. */
  sharedUnprotectedHeader?: JWEHeaderParameters

  /** JWE Per-Recipient Unprotected Header. Not integrity protected. */
  unprotectedHeader?: JWEHeaderParameters
}

/** General JWE JSON Serialization decryption result. */
export interface GeneralDecryptResult extends FlattenedDecryptResult {}

/** Compact JWE decryption result. */
export interface CompactDecryptResult {
  /** Plaintext. */
  plaintext: Uint8Array

  /** JWE Protected Header. */
  protectedHeader: CompactJWEHeaderParameters
}

/** Flattened JWS JSON Serialization verification result. */
export interface FlattenedVerifyResult {
  /** JWS Payload. */
  payload: Uint8Array

  /** JWS Protected Header. */
  protectedHeader?: JWSHeaderParameters

  /** JWS Unprotected Header. Not integrity protected. */
  unprotectedHeader?: JWSHeaderParameters
}

/** General JWS JSON Serialization verification result. */
export interface GeneralVerifyResult extends FlattenedVerifyResult {}

/** Compact JWS verification result. */
export interface CompactVerifyResult {
  /** JWS Payload. */
  payload: Uint8Array

  /** JWS Protected Header. */
  protectedHeader: CompactJWSHeaderParameters
}

/**
 * Signed JSON Web Token (JWT) verification result.
 *
 * @typeParam PayloadType Type definition of the JWT Claims Set the token is expected to carry.
 */
export interface JWTVerifyResult<PayloadType = JWTPayload> {
  /** JWT Claims Set. */
  payload: PayloadType &
    JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)

  /** JWS Protected Header. */
  protectedHeader: JWTHeaderParameters
}

/**
 * Encrypted JSON Web Token (JWT) decryption result.
 *
 * @typeParam PayloadType Type definition of the JWT Claims Set the token is expected to carry.
 */
export interface JWTDecryptResult<PayloadType = JWTPayload> {
  /** JWT Claims Set. */
  payload: PayloadType &
    JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)

  /** JWE Protected Header. */
  protectedHeader: CompactJWEHeaderParameters
}

/**
 * Key resolver result metadata.
 *
 * @typeParam KeyType Type of the resolved key. Inferred from the key resolver function's return
 *   type, so a resolver declared to return only {@link CryptoKey} — as
 *   {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet},
 *   {@link jwks/local.createLocalJWKSet createLocalJWKSet}, and
 *   {@link jwk/embedded.EmbeddedJWK EmbeddedJWK} all are — needs no narrowing at the call site.
 */
export interface ResolvedKey<KeyType extends CryptoKey | Uint8Array = CryptoKey | Uint8Array> {
  /** The resolved key, present only when a key resolver is used. */
  key: KeyType
}

/** Recognized Compact JWS Header Parameters; additional members may also be present. */
export interface CompactJWSHeaderParameters extends JWSHeaderParameters {
  alg: JWSAlgorithm
}

/** Recognized signed JWT Header Parameters; additional members may also be present. */
export interface JWTHeaderParameters extends CompactJWSHeaderParameters {
  b64?: boolean
}

/** Recognized Compact JWE Header Parameters; additional members may also be present. */
export interface CompactJWEHeaderParameters extends JWEHeaderParameters {
  alg: JWEKeyManagementAlgorithm
  enc: JWEContentEncryptionAlgorithm
}

/** JSON Web Key Set. */
export interface JSONWebKeySet {
  keys: JWK[]
}

/**
 * Node.js {@link !KeyObject} representation accepted as key input.
 *
 * Use {@link !createPublicKey}, {@link !createPrivateKey}, or {@link !createSecretKey} to obtain a
 * {@link !KeyObject} from existing key material.
 */
export interface KeyObject {
  type: string
}

/**
 * The runtime's Web Crypto {@link !CryptoKey} representation accepted as key input.
 *
 * In addition to the {@link key/import Key Import Functions}, use {@link !SubtleCrypto.importKey} to
 * obtain a {@link !CryptoKey} from existing key material.
 */
export type CryptoKey = typeof globalThis extends {
  crypto: { subtle: { generateKey(...args: any[]): Promise<infer R> } }
}
  ? Extract<R, { type: string }>
  : CryptoKeyStructuralFallback

/**
 * Structural fallback used when the host {@link !CryptoKey} type cannot be inferred.
 *
 * This is used when the host runtime's `crypto` global is not exposed on `typeof globalThis`,
 * including when it is absent from ambient types or declared with `const` or `let`. It remains
 * structurally compatible with host {@link !CryptoKey} declarations.
 *
 * @internal
 */
export interface CryptoKeyStructuralFallback {
  readonly algorithm: { name: string }
  readonly extractable: boolean
  readonly type: string
  readonly usages: string[]
}

/** Shared fluent API for JWT-producing classes. */
export interface ProduceJWT {
  /**
   * Set the "iss" (Issuer) Claim.
   *
   * @param issuer "Issuer" Claim value to set on the JWT Claims Set.
   */
  setIssuer(issuer: string): this

  /**
   * Set the "sub" (Subject) Claim.
   *
   * @param subject "sub" (Subject) Claim value to set on the JWT Claims Set.
   */
  setSubject(subject: string): this

  /**
   * Set the "aud" (Audience) Claim.
   *
   * @param audience "aud" (Audience) Claim value to set on the JWT Claims Set.
   */
  setAudience(audience: string | string[]): this

  /**
   * Set the "jti" (JWT ID) Claim.
   *
   * @param jwtId "jti" (JWT ID) Claim value to set on the JWT Claims Set.
   */
  setJti(jwtId: string): this

  /**
   * Set the "nbf" (Not Before) Claim. Numbers are Unix timestamps in seconds; Dates are converted
   * to seconds. Strings are relative to now, using seconds, minutes, hours, days, weeks, or years
   * (365.25 days; no months). Prefix `-` or suffix `ago` subtracts the duration.
   *
   * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
   * day".
   *
   * Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
   * "mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
   * "year", "years", "yr", "yrs", and "y".
   *
   * A "from now" suffix can be used for readability when adding to the current Unix timestamp.
   *
   * @param input "nbf" (Not Before) Claim value as a timestamp, Date, or relative duration.
   */
  setNotBefore(input: number | string | Date): this

  /**
   * Set the "exp" (Expiration Time) Claim. Accepts a Unix timestamp in seconds, a Date, or a
   * duration relative to now using the same formats as {@link setNotBefore}.
   *
   * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
   * day".
   *
   * Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
   * "mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
   * "year", "years", "yr", "yrs", and "y".
   *
   * A "from now" suffix can be used for readability when adding to the current Unix timestamp.
   *
   * @param input "exp" (Expiration Time) Claim value as a timestamp, Date, or relative duration.
   */
  setExpirationTime(input: number | string | Date): this

  /**
   * Set the "iat" (Issued At) Claim. Defaults to the current Unix timestamp in seconds. Accepts a
   * Unix timestamp in seconds, a Date, or a duration relative to now using the same formats as
   * {@link setNotBefore}.
   *
   * Format used for time span should be a number followed by a unit, such as "5 minutes" or "1
   * day".
   *
   * Valid unit spellings are: "sec", "secs", "second", "seconds", "s", "minute", "minutes", "min",
   * "mins", "m", "hour", "hours", "hr", "hrs", "h", "day", "days", "d", "week", "weeks", "w",
   * "year", "years", "yr", "yrs", and "y".
   *
   * A "from now" suffix can be used for readability when adding to the current Unix timestamp.
   *
   * @param input "iat" (Issued At) Claim value as a timestamp, Date, or relative duration.
   */
  setIssuedAt(input?: number | string | Date): this
}
