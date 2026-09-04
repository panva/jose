/**
 * JWS "alg" (Algorithm) Header Parameter values supported by this module. Availability of a given
 * identifier additionally depends on the runtime.
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
 * JWE "alg" (Algorithm) Header Parameter values supported by this module. Availability of a given
 * identifier additionally depends on the runtime.
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
 * JWE "enc" (Encryption Algorithm) Header Parameter values supported by this module. Availability
 * of a given identifier additionally depends on the runtime.
 */
export type JWEContentEncryptionAlgorithm =
  | 'A128CBC-HS256'
  | 'A192CBC-HS384'
  | 'A256CBC-HS512'
  | 'A128GCM'
  | 'A192GCM'
  | 'A256GCM'
  | (string & {})

/** JWK "kty" (Key Type) Parameter values supported by this module. */
export type JWKKeyType = 'EC' | 'RSA' | 'OKP' | 'AKP' | 'oct' | (string & {})

/**
 * Generic JSON Web Key Parameters.
 *
 * > Note: This is declared as a type alias rather than an interface so that it satisfies the implicit index
 * > signature of the `JsonWebKey` types shipped by `@types/node` and `lib.dom`.
 */
export type JWKParameters = {
  /** JWK "kty" (Key Type) Parameter */
  kty?: JWKKeyType
  /** JWK "alg" (Algorithm) Parameter */
  alg?: JWSAlgorithm | JWEKeyManagementAlgorithm | JWEContentEncryptionAlgorithm
  /** JWK "key_ops" (Key Operations) Parameter */
  key_ops?: string[]
  /** JWK "ext" (Extractable) Parameter */
  ext?: boolean
  /** JWK "use" (Public Key Use) Parameter */
  use?: 'sig' | 'enc' | (string & {})
  /** JWK "x5c" (X.509 Certificate Chain) Parameter */
  x5c?: string[]
  /** JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter */
  x5t?: string
  /** JWK "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter */
  'x5t#S256'?: string
  /** JWK "x5u" (X.509 URL) Parameter */
  x5u?: string
  /** JWK "kid" (Key ID) Parameter */
  kid?: string
}

/** Convenience interface for public OKP JSON Web Keys. */
export interface JWK_OKP_Public extends JWKParameters {
  /** OKP JWK "crv" (The Subtype of Key Pair) Parameter */
  crv: string
  /** OKP JWK "x" (The public key) Parameter */
  x: string
}

/** Convenience interface for private OKP JSON Web Keys. */
export interface JWK_OKP_Private extends JWK_OKP_Public {
  /** OKP JWK "d" (The Private Key) Parameter */
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
  /** EC JWK "crv" (Curve) Parameter */
  crv: string
  /** EC JWK "x" (X Coordinate) Parameter */
  x: string
  /** EC JWK "y" (Y Coordinate) Parameter */
  y: string
}

/** Convenience interface for private EC JSON Web Keys. */
export interface JWK_EC_Private extends JWK_EC_Public {
  /** EC JWK "d" (ECC Private Key) Parameter */
  d: string
}

/** Convenience interface for public RSA JSON Web Keys. */
export interface JWK_RSA_Public extends JWKParameters {
  /** RSA JWK "e" (Exponent) Parameter */
  e: string
  /** RSA JWK "n" (Modulus) Parameter */
  n: string
}

/** Convenience interface for private RSA JSON Web Keys. */
export interface JWK_RSA_Private extends JWK_RSA_Public {
  /** RSA JWK "d" (Private Exponent) Parameter */
  d: string
  /** RSA JWK "dp" (First Factor CRT Exponent) Parameter */
  dp: string
  /** RSA JWK "dq" (Second Factor CRT Exponent) Parameter */
  dq: string
  /** RSA JWK "p" (First Prime Factor) Parameter */
  p: string
  /** RSA JWK "q" (Second Prime Factor) Parameter */
  q: string
  /** RSA JWK "qi" (First CRT Coefficient) Parameter */
  qi: string
}

/** Convenience interface for "oct" JSON Web Keys. */
export interface JWK_oct extends JWKParameters {
  /** Oct JWK "k" (Key Value) Parameter */
  k: string
}

/**
 * JSON Web Key ({@link https://www.rfc-editor.org/info/rfc7517/ JWK}). "RSA", "EC", "OKP", "AKP",
 * and "oct" key types are supported.
 *
 * > Note: This is declared as a type alias rather than an interface so that it satisfies the implicit index
 * > signature of the `JsonWebKey` types shipped by `@types/node` and `lib.dom`. It spells out the
 * > {@link JWKParameters} members rather than intersecting them so that every JWK member is documented
 * > in one place.
 */
export type JWK = {
  /** JWK "kty" (Key Type) Parameter */
  kty?: JWKKeyType
  /** JWK "alg" (Algorithm) Parameter */
  alg?: JWSAlgorithm | JWEKeyManagementAlgorithm | JWEContentEncryptionAlgorithm
  /** JWK "key_ops" (Key Operations) Parameter */
  key_ops?: string[]
  /** JWK "ext" (Extractable) Parameter */
  ext?: boolean
  /** JWK "use" (Public Key Use) Parameter */
  use?: 'sig' | 'enc' | (string & {})
  /** JWK "x5c" (X.509 Certificate Chain) Parameter */
  x5c?: string[]
  /** JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter */
  x5t?: string
  /** JWK "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter */
  'x5t#S256'?: string
  /** JWK "x5u" (X.509 URL) Parameter */
  x5u?: string
  /** JWK "kid" (Key ID) Parameter */
  kid?: string
  /**
   * - EC JWK "crv" (Curve) Parameter
   * - OKP JWK "crv" (The Subtype of Key Pair) Parameter
   */
  crv?: string
  /**
   * - Private RSA JWK "d" (Private Exponent) Parameter
   * - Private EC JWK "d" (ECC Private Key) Parameter
   * - Private OKP JWK "d" (The Private Key) Parameter
   */
  d?: string
  /** Private RSA JWK "dp" (First Factor CRT Exponent) Parameter */
  dp?: string
  /** Private RSA JWK "dq" (Second Factor CRT Exponent) Parameter */
  dq?: string
  /** RSA JWK "e" (Exponent) Parameter */
  e?: string
  /** Oct JWK "k" (Key Value) Parameter */
  k?: string
  /** RSA JWK "n" (Modulus) Parameter */
  n?: string
  /** Private RSA JWK "p" (First Prime Factor) Parameter */
  p?: string
  /** Private RSA JWK "q" (Second Prime Factor) Parameter */
  q?: string
  /** Private RSA JWK "qi" (First CRT Coefficient) Parameter */
  qi?: string
  /**
   * - EC JWK "x" (X Coordinate) Parameter
   * - OKP JWK "x" (The public key) Parameter
   */
  x?: string
  /** EC JWK "y" (Y Coordinate) Parameter */
  y?: string
  /** AKP JWK "pub" (Public Key) Parameter */
  pub?: string
  /** AKP JWK "priv" (Private key) Parameter */
  priv?: string
  /** RSA JWK "oth" (Other Primes Info) Parameter */
  oth?: Array<{
    /** The Factor CRT Exponent */
    d?: string
    /** The Prime Factor */
    r?: string
    /** The Factor CRT Coefficient */
    t?: string
  }>
}

/** Discriminated union of the supported JSON Web Key shapes. */
// The "kty" is intersected into each arm one at a time rather than distributed over a parenthesised
// union - `X & (A | B)` means the same thing, but typedoc renders it without the parentheses, which
// reads as though the second arm carried no "kty" at all.
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

/** Key or secret input accepted by all sign, verify, encrypt, and decrypt operations. */
export type KeyInput = CryptoKey | KeyObject | JWK | Uint8Array

/** Dynamic key resolver for consuming operations. */
export interface GetKeyFunction<IProtectedHeader, IToken, KeyTypes extends KeyInput = KeyInput> {
  /**
   * Dynamic key resolution function. No token components have been verified at the time of this
   * function call. If a suitable key for the token cannot be matched, throw an error instead.
   *
   * @param token The consumed JWE or JWS token.
   */
  (protectedHeader: IProtectedHeader, token: IToken): Promise<KeyTypes> | KeyTypes
}

/** Flattened JWS verification input. */
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
   * "b64": false is used the value passed may also be a {@link !Uint8Array}.
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

/** General JWS verification input. */
export interface GeneralJWSInput {
  /**
   * The "payload" member MUST be present and contain the value BASE64URL(JWS Payload). When when
   * JWS Unencoded Payload ({@link https://www.rfc-editor.org/info/rfc7797/ RFC7797}) "b64": false is
   * used the value passed may also be a {@link !Uint8Array}.
   */
  payload: string | Uint8Array

  /**
   * The "signatures" member value MUST be an array of JSON objects. Each object represents a
   * signature or MAC over the JWS Payload and the JWS Protected Header.
   */
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}

/** Flattened JWS JSON Serialization token. */
export interface FlattenedJWS extends Partial<FlattenedJWSInput> {
  payload: string
  signature: string
}

/** General JWS JSON Serialization token. */
export interface GeneralJWS {
  payload: string
  signatures: Omit<FlattenedJWSInput, 'payload'>[]
}

/** Header Parameters common to JWE and JWS. */
export interface JoseHeaderParameters {
  /** "kid" (Key ID) Header Parameter */
  kid?: string

  /** "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter */
  x5t?: string

  /** "x5c" (X.509 Certificate Chain) Header Parameter */
  x5c?: string[]

  /** "x5u" (X.509 URL) Header Parameter */
  x5u?: string

  /** "jku" (JWK Set URL) Header Parameter */
  jku?: string

  /**
   * "jwk" (JSON Web Key) Header Parameter. This must be a public JSON Web Key; private and
   * symmetric key parameters are not permitted.
   */
  jwk?: Omit<JWK, 'd' | 'dp' | 'dq' | 'k' | 'p' | 'q' | 'qi' | 'priv' | 'oth'>

  /** "typ" (Type) Header Parameter */
  typ?: string

  /** "cty" (Content Type) Header Parameter */
  cty?: string
}

/** Recognized JWS Header Parameters; additional members may also be present. */
export interface JWSHeaderParameters extends JoseHeaderParameters {
  /** JWS "alg" (Algorithm) Header Parameter */
  alg?: JWSAlgorithm

  /**
   * This JWS Extension Header Parameter modifies the JWS Payload representation and the JWS Signing
   * Input computation as per {@link https://www.rfc-editor.org/info/rfc7797/ RFC7797}.
   */
  b64?: boolean

  /** JWS "crit" (Critical) Header Parameter */
  crit?: string[]

  /** Any other JWS Header member. */
  [propName: string]: unknown
}

/** Recognized JWE Key Management-related Header Parameters. */
export interface JWEKeyManagementHeaderParameters {
  /**
   * ECDH-ES "apu" (Agreement PartyUInfo). This will be used as a JOSE Header Parameter and will be
   * used in ECDH's ConcatKDF.
   */
  apu?: Uint8Array

  /**
   * ECDH-ES "apv" (Agreement PartyVInfo). This will be used as a JOSE Header Parameter and will be
   * used in ECDH's ConcatKDF.
   */
  apv?: Uint8Array

  /**
   * PBES2 "p2c" (PBES2 Count). This will be used as a JOSE Header Parameter and as the PBKDF2
   * iteration count.
   */
  p2c?: number

  /**
   * @deprecated You should not use this parameter. It is only intended for testing and vector
   *   validation purposes.
   */
  p2s?: Uint8Array
  /**
   * @deprecated You should not use this parameter. It is only intended for testing and vector
   *   validation purposes.
   */
  iv?: Uint8Array
  /**
   * @deprecated You should not use this parameter. It is only intended for testing and vector
   *   validation purposes.
   */
  epk?: CryptoKey | KeyObject
}

/** Flattened JWE JSON Serialization token. */
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
  iv?: string

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
  tag?: string

  /**
   * The "unprotected" member MUST be present and contain the value JWE Shared Unprotected Header
   * when the JWE Shared Unprotected Header value is non-empty; otherwise, it MUST be absent. This
   * value is represented as an unencoded JSON object, rather than as a string. These Header
   * Parameter values are not integrity protected.
   */
  unprotected?: JWEHeaderParameters
}

/** General JWE JSON Serialization token. */
export interface GeneralJWE extends Omit<FlattenedJWE, 'encrypted_key' | 'header'> {
  recipients: Pick<FlattenedJWE, 'encrypted_key' | 'header'>[]
}

/** Recognized JWE Header Parameters; additional members may also be present. */
export interface JWEHeaderParameters extends JoseHeaderParameters {
  /** JWE "alg" (Algorithm) Header Parameter */
  alg?: JWEKeyManagementAlgorithm

  /** JWE "enc" (Encryption Algorithm) Header Parameter */
  enc?: JWEContentEncryptionAlgorithm

  /** JWE "crit" (Critical) Header Parameter */
  crit?: string[]

  /**
   * JWE "zip" (Compression Algorithm) Header Parameter. The only supported value is `"DEF"`
   * (DEFLATE), and it requires the `CompressionStream` / `DecompressionStream` APIs to be available
   * in the runtime.
   */
  zip?: 'DEF' | (string & {})

  /** Any other JWE Header member. */
  [propName: string]: unknown
}

/** Shared "crit" option for signing, verification, encryption, and decryption. */
export interface CritOption {
  /**
   * An object with keys representing recognized "crit" (Critical) Header Parameter names. The value
   * for those is either `true` or `false`. `true` when the Header Parameter MUST be integrity
   * protected, `false` when it's irrelevant. The JWS extension Header Parameter `b64` is always
   * recognized and processed properly; no other registered Header Parameters currently receive this
   * built-in treatment.
   *
   * > Warning: This only checks that the Header Parameter is syntactically correct when provided and,
   * > optionally, integrity protected. It does not process the Header Parameter or reject the
   * > operation when it is missing. You MUST still verify its presence and process it according to
   * > the profile's validation steps after the operation succeeds.
   */
  crit?: {
    [propName: string]: boolean
  }
}

/** JWE Decryption options. */
export interface DecryptOptions extends CritOption {
  /**
   * A list of accepted JWE "alg" (Algorithm) Header Parameter values. By default all "alg"
   * (Algorithm) Header Parameter values applicable for the used key/secret are allowed except for
   * all PBES2 Key Management Algorithms, these need to be explicitly allowed using this option.
   */
  keyManagementAlgorithms?: JWEKeyManagementAlgorithm[]

  /**
   * A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values. By default all
   * "enc" (Encryption Algorithm) values applicable for the used key/secret are allowed.
   */
  contentEncryptionAlgorithms?: JWEContentEncryptionAlgorithm[]

  /**
   * (PBES2 Key Management Algorithms only) Maximum allowed "p2c" (PBES2 Count) Header Parameter
   * value. The PBKDF2 iteration count defines the algorithm's computational expense. By default
   * this value is set to 10000. The value must be a positive safe integer or `Infinity`. Set it to
   * `Infinity` to disable the limit.
   */
  maxPBES2Count?: number

  /**
   * Maximum allowed size (in bytes) of the decompressed plaintext when the JWE `"zip"` (Compression
   * Algorithm) Header Parameter is present. By default this value is set to 250000 (250 KB). The
   * value must be `0`, a positive safe integer, or `Infinity`. Set it to `0` to reject all
   * compressed JWEs during decryption or to `Infinity` to disable the decompressed size limit.
   */
  maxDecompressedLength?: number
}

/** JWE Encryption options. */
export interface EncryptOptions extends CritOption {}

/** JWT Claims Set verification options. */
export interface JWTClaimVerificationOptions {
  /**
   * Expected JWT "aud" (Audience) Claim value(s). This option makes the JWT "aud" (Audience) Claim
   * presence required.
   */
  audience?: string | string[]

  /**
   * Clock skew tolerance in seconds when a number (e.g. 5), or resolved into seconds when a string
   * (e.g. "5 seconds", "10 minutes", "2 hours"). Used when validating the JWT "nbf" (Not Before)
   * and "exp" (Expiration Time) claims, and when validating the "iat" (Issued At) claim if the
   * {@link maxTokenAge `maxTokenAge` option} is set.
   */
  clockTolerance?: string | number

  /**
   * Expected JWT "iss" (Issuer) Claim value(s). This option makes the JWT "iss" (Issuer) Claim
   * presence required.
   */
  issuer?: string | string[]

  /**
   * Maximum time elapsed from the JWT "iat" (Issued At) Claim value, in seconds when a number (e.g.
   * 5), or resolved into seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours"). This
   * option makes the JWT "iat" (Issued At) Claim presence required.
   */
  maxTokenAge?: string | number

  /**
   * Expected JWT "sub" (Subject) Claim value. This option makes the JWT "sub" (Subject) Claim
   * presence required.
   */
  subject?: string

  /**
   * Expected JWT "typ" (Type) Header Parameter value. This option makes the JWT "typ" (Type) Header
   * Parameter presence required.
   */
  typ?: string

  /** Date to use when comparing NumericDate claims, defaults to `new Date()`. */
  currentDate?: Date

  /**
   * Array of required Claim Names that must be present in the JWT Claims Set. Default is that: if
   * the {@link issuer `issuer` option} is set, then JWT "iss" (Issuer) Claim must be present; if the
   * {@link audience `audience` option} is set, then JWT "aud" (Audience) Claim must be present; if
   * the {@link subject `subject` option} is set, then JWT "sub" (Subject) Claim must be present; if
   * the {@link maxTokenAge `maxTokenAge` option} is set, then JWT "iat" (Issued At) Claim must be
   * present.
   */
  requiredClaims?: string[]
}

/** JWS Verification options. */
export interface VerifyOptions extends CritOption {
  /**
   * A list of accepted JWS "alg" (Algorithm) Header Parameter values. By default all "alg"
   * (Algorithm) values applicable for the used key/secret are allowed.
   *
   * > Note: Unsecured JWTs (`{ "alg": "none" }`) are never accepted by this API.
   */
  algorithms?: JWSAlgorithm[]
}

/** JWS Signing options. */
export interface SignOptions extends CritOption {}

/** Recognized JWT Claims Set members; additional members may also be present. */
export interface JWTPayload {
  /** JWT Issuer */
  iss?: string

  /** JWT Subject */
  sub?: string

  /** JWT Audience */
  aud?: string | string[]

  /** JWT ID */
  jti?: string

  /** JWT Not Before */
  nbf?: number

  /** JWT Expiration Time */
  exp?: number

  /** JWT Issued At */
  iat?: number

  /** Any other JWT Claim Set member. */
  [propName: string]: unknown
}

/** Flattened JWE JSON Serialization decryption result. */
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

  /** JWS Unprotected Header. */
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

/** Signed JSON Web Token (JWT) verification result. */
export interface JWTVerifyResult<PayloadType = JWTPayload> {
  /** JWT Claims Set. */
  payload: PayloadType &
    JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)

  /** JWS Protected Header. */
  protectedHeader: JWTHeaderParameters
}

/** Encrypted JSON Web Token (JWT) decryption result. */
export interface JWTDecryptResult<PayloadType = JWTPayload> {
  /** JWT Claims Set. */
  payload: PayloadType &
    JWTPayload &
    ([PayloadType] extends [object] ? unknown : unknown extends PayloadType ? unknown : never)

  /** JWE Protected Header. */
  protectedHeader: CompactJWEHeaderParameters
}

/** Key resolver result metadata. */
export interface ResolvedKey<KeyType extends CryptoKey | Uint8Array = CryptoKey | Uint8Array> {
  /** Key resolved from the key resolver function. */
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

/** Node.js {@link !KeyObject} representation accepted as key input. */
export interface KeyObject {
  type: string
}

/** Web Cryptography API {@link !CryptoKey} representation accepted as key input. */
export type CryptoKey = typeof globalThis extends {
  crypto: { subtle: { generateKey(...args: any[]): Promise<infer R> } }
}
  ? Extract<R, { type: string }>
  : CryptoKeyStructuralFallback

/** Structural fallback used when a host {@link !CryptoKey} type cannot be inferred. */
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
   * Set the "nbf" (Not Before) Claim. A `number` is used directly, a `Date` is converted to a Unix
   * timestamp, and a `string` is parsed as a time span relative to the current Unix timestamp.
   * String units may be seconds, minutes, hours, days, weeks, or years; months are unsupported and
   * a year is 365.25 days. A leading `-` or trailing `"ago"` subtracts the time span.
   *
   * @param input "nbf" (Not Before) Claim value to set on the JWT Claims Set.
   */
  setNotBefore(input: number | string | Date): this

  /**
   * Set the "exp" (Expiration Time) Claim. A `number` is used directly, a `Date` is converted to a
   * Unix timestamp, and a `string` is parsed as a time span relative to the current Unix timestamp.
   * String units may be seconds, minutes, hours, days, weeks, or years; months are unsupported and
   * a year is 365.25 days. A leading `-` or trailing `"ago"` subtracts the time span.
   *
   * @param input "exp" (Expiration Time) Claim value to set on the JWT Claims Set.
   */
  setExpirationTime(input: number | string | Date): this

  /**
   * Set the "iat" (Issued At) Claim. With no argument the current Unix timestamp is used. A
   * `number` is used directly, a `Date` is converted to a Unix timestamp, and a `string` is parsed
   * as a time span relative to the current Unix timestamp. String units may be seconds, minutes,
   * hours, days, weeks, or years; months are unsupported and a year is 365.25 days. A leading `-`
   * or trailing `"ago"` subtracts the time span.
   *
   * @param input "iat" (Issued At) Claim value to set on the JWT Claims Set.
   */
  setIssuedAt(input?: number | string | Date): this
}
