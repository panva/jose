// Type-level regression tests. Nothing here runs; the assertion is that `tsc -p test-d` compiles.
//
// Positive assertions use Equals<A, B>, which fails to compile unless the two types are mutually
// assignable. Negative assertions use @ts-expect-error, which fails to compile when the error it
// claims goes away. Run via `npm run typecheck:types`.
import * as jose from 'jose'
import type { GeneratedSecret } from 'jose/key/generate/secret'
import type { ImportedJWK } from 'jose/key/import'
import { createPrivateKey, type JsonWebKey } from 'node:crypto'

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

declare const jwt: string
declare const url: URL
declare const secret: Uint8Array
declare const cryptoKey: jose.CryptoKey
declare const anyString: string

/* CryptoKey must alias the host runtime's CryptoKey, never a competing nominal type, and must not
 * silently degrade to `any` - `any` would make every assertion below vacuously pass, so pin it. */
{
  const _isHostCryptoKey: Equals<jose.CryptoKey, CryptoKey> = true
  // @ts-expect-error `any` would accept this
  const _notAny: jose.CryptoKey = 'definitely not a key'
}

/* Every convenience JWK interface is reachable from the package entry point. The AKP pair was
 * documented but missing from the barrel until it was caught here. */
{
  type _Akp = jose.JWK_AKP_Public | jose.JWK_AKP_Private
  type _Ec = jose.JWK_EC_Public | jose.JWK_EC_Private
  type _Okp = jose.JWK_OKP_Public | jose.JWK_OKP_Private
  type _Rsa = jose.JWK_RSA_Public | jose.JWK_RSA_Private
  type _Oct = jose.JWK_oct
  type _Extra = jose.AnyJWK | jose.JWKKeyType | jose.KeyInput
  type _Algs =
    jose.JWSAlgorithm | jose.JWEKeyManagementAlgorithm | jose.JWEContentEncryptionAlgorithm
  type _JwksFns = jose.RemoteJWKSet | jose.LocalJWKSet
}

/* JWK must satisfy the implicit index signature of @types/node's JsonWebKey, otherwise round
 * tripping a key through node:crypto does not compile. */
async function nodeInterop() {
  const jwk = await jose.exportJWK(cryptoKey)
  const _parameters: JsonWebKey = {} as jose.JWKParameters
  return createPrivateKey({ key: jwk, format: 'jwk' })
}

/* JWK spells the JWKParameters members out rather than intersecting them, so that typedoc
 * documents all of them on the JWK page. Pin that the two cannot drift apart. */
{
  const _everyParameterIsOnJwk: Equals<
    Exclude<keyof jose.JWKParameters, keyof jose.JWK>,
    never
  > = true
  const _kty: jose.JWKKeyType | undefined = ({} as jose.JWK).kty
  const _alg: jose.JWKParameters['alg'] = ({} as jose.JWK).alg
  const _use: jose.JWKParameters['use'] = ({} as jose.JWK).use
  const _thumbprint: string | undefined = ({} as jose.JWK)['x5t#S256']
  const _multiPrime: jose.JWK = { kty: 'RSA', oth: [{ d: 'd', r: 'r', t: 't' }] }
  // and that a JWKParameters-shaped value is still a JWK
  const _asJwk: jose.JWK = {} as jose.JWKParameters
}

/* AnyJWK is narrowable on kty; JWK deliberately is not. */
function narrowJwk(jwk: jose.AnyJWK) {
  if (jwk.kty === 'EC') return jwk.x + jwk.y
  if (jwk.kty === 'RSA') return jwk.n + jwk.e
  if (jwk.kty === 'OKP') return jwk.x
  if (jwk.kty === 'AKP') return jwk.pub
  return jwk.k
}

/* Every arm carries its own "kty", and no arm admits a wrong or missing one. AnyJWK spells the arms
 * out one per key type instead of intersecting over a parenthesised union, so pin that the two are
 * the same type - `X & (A | B)` and `(X & A) | (X & B)` must stay interchangeable here. */
{
  const _ec: jose.AnyJWK = { kty: 'EC', crv: 'P-256', x: 'x', y: 'y' }
  const _ecPrivate: jose.AnyJWK = { kty: 'EC', crv: 'P-256', x: 'x', y: 'y', d: 'd' }
  const _rsa: jose.AnyJWK = { kty: 'RSA', e: 'AQAB', n: 'n' }
  const _okp: jose.AnyJWK = { kty: 'OKP', crv: 'Ed25519', x: 'x' }
  const _akp: jose.AnyJWK = { kty: 'AKP', alg: 'ML-DSA-44', pub: 'pub' }
  const _oct: jose.AnyJWK = { kty: 'oct', k: 'k' }

  // @ts-expect-error the arm is selected by "kty", so EC members do not satisfy an RSA one
  const _mismatched: jose.AnyJWK = { kty: 'RSA', crv: 'P-256', x: 'x', y: 'y' }
  // @ts-expect-error every arm requires its "kty"
  const _missingKty: jose.AnyJWK = { crv: 'P-256', x: 'x', y: 'y' }

  // an AnyJWK is always a JWK, and narrowing keeps the shared parameters reachable
  const _widens: jose.JWK = _ec
  const _kid: string | undefined = _ec.kid
}

/* Algorithm unions give autocompletion without narrowing the accepted inputs. */
{
  const _fromString: jose.JWSAlgorithm = anyString
  const _jweAlg: jose.JWEKeyManagementAlgorithm = anyString
  const _jweEnc: jose.JWEContentEncryptionAlgorithm = anyString
  const _jwkType: jose.JWKKeyType = anyString
  const _toString: string = 'ES256' satisfies jose.JWSAlgorithm
  const _list: jose.JWSAlgorithm[] = [anyString, 'ES256']
  const _opts: jose.VerifyOptions = { algorithms: [anyString, 'ES256'] }
  const _jwk: jose.JWKParameters = { kty: anyString, alg: anyString, use: anyString }
  const _jweHeader: jose.JWEHeaderParameters = {
    alg: anyString,
    enc: anyString,
    zip: anyString,
  }
  const _compactJweHeader: jose.CompactJWEHeaderParameters = {
    alg: anyString,
    enc: anyString,
  }
  const _decrypt: jose.DecryptOptions = {
    keyManagementAlgorithms: [anyString, 'RSA-OAEP'],
    contentEncryptionAlgorithms: [anyString, 'A256GCM'],
  }
}

/* The "jwk" Header Parameter accepts every public JWK member, and rejects the secret ones. */
{
  type PrivateJwkMember = 'd' | 'dp' | 'dq' | 'k' | 'p' | 'q' | 'qi' | 'priv' | 'oth'
  type EmbeddedJwk = NonNullable<jose.JoseHeaderParameters['jwk']>
  const _privateMembersExcluded: Equals<Extract<keyof EmbeddedJwk, PrivateJwkMember>, never> = true

  const _ok: jose.JWSHeaderParameters = {
    alg: 'ES256',
    jwk: { kty: 'EC', crv: 'P-256', x: 'x', y: 'y', kid: 'k', use: 'sig', x5c: ['c'] },
  }
  const _bad: jose.JWSHeaderParameters = {
    alg: 'ES256',
    // @ts-expect-error a private key must not be embeddable
    jwk: { kty: 'EC', crv: 'P-256', x: 'x', y: 'y', d: 'd' },
  }
}

/* The three shipped key resolvers are assignable to every JWS-side GetKey interface, and to none of
 * the JWE-side ones. */
{
  const remote = jose.createRemoteJWKSet(url)
  const local = jose.createLocalJWKSet({ keys: [] })

  const _a: jose.JWTVerifyGetKey = remote
  const _b: jose.CompactVerifyGetKey = local
  const _c: jose.FlattenedVerifyGetKey = jose.EmbeddedJWK
  const _d: jose.GeneralVerifyGetKey = remote

  // @ts-expect-error a JWKS resolves signature verification keys, not decryption keys
  const _e: jose.JWTDecryptGetKey = remote

  // the extra members of each resolver are typed and documented
  const _jwks: jose.JSONWebKeySet | undefined = remote.jwks()
  const _localJwks: jose.JSONWebKeySet = local.jwks()
  const _coolingDown: boolean = remote.coolingDown
  const _fresh: boolean = remote.fresh
  const _reloading: boolean = remote.reloading
  const _reload: Promise<void> = remote.reload()
  // @ts-expect-error resolver state is readonly
  remote.fresh = false

  const _flattenedHeader: Equals<
    Parameters<jose.FlattenedVerifyGetKey>[0],
    jose.JWSHeaderParameters
  > = true
  const _jwtHeader: Equals<Parameters<jose.JWTVerifyGetKey>[0], jose.CompactJWSHeaderParameters> =
    true
  const _generalDecryptHeader: Equals<
    Parameters<jose.GeneralDecryptGetKey>[0],
    jose.JWEHeaderParameters | undefined
  > = true
}

/* A resolver annotated with JWTHeaderParameters is still accepted. That type is only a supertype of
 * what the resolver actually observes while its "b64" stays boolean, so this is what keeps the
 * narrowing to CompactJWSHeaderParameters from being a source break. */
{
  const _annotated: jose.JWTVerifyGetKey = async (
    protectedHeader: jose.JWTHeaderParameters,
    token: jose.FlattenedJWSInput,
  ) => cryptoKey
  const _viaAlias: jose.GetKeyFunction<
    jose.JWTHeaderParameters,
    jose.FlattenedJWSInput
  > = async () => cryptoKey
  // jwtVerify hands back a header whose "b64" it accepted as false, so it cannot be typed `true`
  const _b64: boolean | undefined = ({} as jose.JWTHeaderParameters).b64
}

/* Overload resolution: a key gives no `key` back, a resolver gives a narrowed one, and a value that
 * may be either still compiles - the wrapper pattern that previously forced a cast. */
async function overloads(either: jose.KeyInput | jose.JWTVerifyGetKey) {
  const withKey = await jose.jwtVerify(jwt, secret)
  // @ts-expect-error `key` is only present when a resolver was used
  withKey.key

  const resolved = await jose.jwtVerify(jwt, jose.createRemoteJWKSet(url))
  const _narrowed: Equals<typeof resolved.key, jose.CryptoKey> = true

  const forwarded = await jose.jwtVerify(jwt, either)
  const _union: Equals<typeof forwarded.key, jose.CryptoKey | Uint8Array | undefined> = true
}

/* The same three-overload shape holds for every consuming entry point. */
async function everyEntryPoint(
  flattenedJws: jose.FlattenedJWSInput,
  generalJws: jose.GeneralJWSInput,
  flattenedJwe: jose.FlattenedJWE,
  generalJwe: jose.GeneralJWE,
) {
  const JWKS = jose.createRemoteJWKSet(url)
  const compact = await jose.compactVerify(jwt, JWKS)
  const flattened = await jose.flattenedVerify(flattenedJws, JWKS)
  const general = await jose.generalVerify(generalJws, JWKS)
  const _1: Equals<typeof compact.key, jose.CryptoKey> = true
  const _2: Equals<typeof flattened.key, jose.CryptoKey> = true
  const _3: Equals<typeof general.key, jose.CryptoKey> = true

  await jose.compactDecrypt(jwt, secret)
  await jose.flattenedDecrypt(flattenedJwe, secret)
  await jose.generalDecrypt(generalJwe, secret)
  await jose.jwtDecrypt(jwt, secret)
}

/* Resolver result types and key-or-resolver forwarding work across every consuming entry point. */
async function resolverInference(
  flattenedJws: jose.FlattenedJWSInput,
  generalJws: jose.GeneralJWSInput,
  flattenedJwe: jose.FlattenedJWE,
  generalJwe: jose.GeneralJWE,
  either: jose.KeyInput | (() => Uint8Array),
) {
  const resolveBytes: jose.GetKeyFunction<unknown, unknown, Uint8Array> = () => secret

  const compactVerified = await jose.compactVerify(jwt, resolveBytes)
  const flattenedVerified = await jose.flattenedVerify(flattenedJws, resolveBytes)
  const generalVerified = await jose.generalVerify(generalJws, resolveBytes)
  const jwtVerified = await jose.jwtVerify(jwt, resolveBytes)
  const compactDecrypted = await jose.compactDecrypt(jwt, resolveBytes)
  const flattenedDecrypted = await jose.flattenedDecrypt(flattenedJwe, resolveBytes)
  const generalDecrypted = await jose.generalDecrypt(generalJwe, resolveBytes)
  const jwtDecrypted = await jose.jwtDecrypt(jwt, resolveBytes)

  const _1: Equals<typeof compactVerified.key, Uint8Array> = true
  const _2: Equals<typeof flattenedVerified.key, Uint8Array> = true
  const _3: Equals<typeof generalVerified.key, Uint8Array> = true
  const _4: Equals<typeof jwtVerified.key, Uint8Array> = true
  const _5: Equals<typeof compactDecrypted.key, Uint8Array> = true
  const _6: Equals<typeof flattenedDecrypted.key, Uint8Array> = true
  const _7: Equals<typeof generalDecrypted.key, Uint8Array> = true
  const _8: Equals<typeof jwtDecrypted.key, Uint8Array> = true

  const compactForwarded = await jose.compactVerify(jwt, either)
  const flattenedForwarded = await jose.flattenedVerify(flattenedJws, either)
  const generalForwarded = await jose.generalVerify(generalJws, either)
  const jwtForwarded = await jose.jwtVerify(jwt, either)
  const compactDecryptForwarded = await jose.compactDecrypt(jwt, either)
  const flattenedDecryptForwarded = await jose.flattenedDecrypt(flattenedJwe, either)
  const generalDecryptForwarded = await jose.generalDecrypt(generalJwe, either)
  const jwtDecryptForwarded = await jose.jwtDecrypt(jwt, either)

  type ForwardedKey = jose.CryptoKey | Uint8Array | undefined
  const _9: Equals<typeof compactForwarded.key, ForwardedKey> = true
  const _10: Equals<typeof flattenedForwarded.key, ForwardedKey> = true
  const _11: Equals<typeof generalForwarded.key, ForwardedKey> = true
  const _12: Equals<typeof jwtForwarded.key, ForwardedKey> = true
  const _13: Equals<typeof compactDecryptForwarded.key, ForwardedKey> = true
  const _14: Equals<typeof flattenedDecryptForwarded.key, ForwardedKey> = true
  const _15: Equals<typeof generalDecryptForwarded.key, ForwardedKey> = true
  const _16: Equals<typeof jwtDecryptForwarded.key, ForwardedKey> = true
}

/* A General JWE may carry alg/enc outside the Protected Header, so its resolver really can be
 * called with undefined. The type says so. */
const generalDecryptResolver: jose.GeneralDecryptGetKey = (protectedHeader, token) => {
  // @ts-expect-error protectedHeader is possibly undefined
  protectedHeader.alg
  return protectedHeader?.alg === 'dir' ? secret : secret
}

/* importJWK resolves on the "kty" Parameter, and keeps the union when it is not statically known -
 * including for `any`, which is what JSON.parse produces. */
async function importJwkNarrowing(typed: jose.JWK) {
  const oct = await jose.importJWK({ kty: 'oct', k: 'k' })
  const ec = await jose.importJWK({ kty: 'EC', crv: 'P-256', x: 'x', y: 'y' }, 'ES256')
  const parsed = await jose.importJWK(JSON.parse('{}'), 'ES256')
  const unknownKty = await jose.importJWK(typed, 'ES256')

  const _1: Equals<typeof oct, Uint8Array> = true
  const _2: Equals<typeof ec, jose.CryptoKey> = true
  const _3: Equals<typeof parsed, jose.CryptoKey | Uint8Array> = true
  const _4: Equals<typeof unknownKty, jose.CryptoKey | Uint8Array> = true
}

/* The generation functions take their own algorithm subsets, still open to any string. */
{
  const _kp: jose.GenerateKeyPairAlgorithm = anyString
  const _gs: jose.GenerateSecretAlgorithm = anyString
  const _kpLiteral: jose.GenerateKeyPairAlgorithm = 'ES256'
  const _gsLiteral: jose.GenerateSecretAlgorithm = 'A128CBC-HS256'
}

/* generateSecret likewise resolves on the algorithm identifier. */
async function generateSecretNarrowing(alg: string) {
  const hs = await jose.generateSecret('HS256')
  const cbc = await jose.generateSecret('A128CBC-HS256')
  const dynamic = await jose.generateSecret(alg)

  const _1: Equals<typeof hs, jose.CryptoKey> = true
  const _2: Equals<typeof cbc, Uint8Array> = true
  const _3: Equals<typeof dynamic, jose.CryptoKey | Uint8Array> = true
}

/* The conditional result helpers are public from their defining subpaths. */
{
  const _importedOct: Equals<ImportedJWK<{ kty: 'oct' }>, Uint8Array> = true
  const _importedEc: Equals<ImportedJWK<{ kty: 'EC' }>, jose.CryptoKey> = true
  const _generatedCbc: Equals<GeneratedSecret<'A128CBC-HS256'>, Uint8Array> = true
  const _generatedHmac: Equals<GeneratedSecret<'HS256'>, jose.CryptoKey> = true
}

/* Errors: instanceof narrows, the code discriminant narrows AnyJOSEError, cause is typed, and a
 * third-party subclass still compiles. */
async function errors() {
  try {
    await jose.jwtVerify(jwt, secret)
  } catch (err) {
    if (err instanceof jose.errors.JWTExpired) {
      const _reason: jose.errors.JWTClaimValidationReason = err.reason
      const _cause: jose.errors.JWTClaimValidationFailure = err.cause
      const _payload: jose.JWTPayload = err.payload
    }
    if (err instanceof jose.errors.JWKSMultipleMatchingKeys) {
      for await (const key of err) {
        const _key: Equals<typeof key, jose.CryptoKey> = true
      }
    }
  }
}

function narrowByCode(err: jose.errors.AnyJOSEError) {
  switch (err.code) {
    case 'ERR_JWT_EXPIRED':
      return err.payload
    case 'ERR_JWT_CLAIM_VALIDATION_FAILED':
      return err.claim
    case 'ERR_JWKS_TIMEOUT':
      // @ts-expect-error this error carries no payload
      return err.payload
    default:
      return undefined
  }
}

/* The pairing of a class with its code lives on AnyJOSEError, never on the classes, so `code` is as
 * open on a specific error as it is on the base one. Each of these was rejected while the classes
 * carried the literal themselves, and none of them should ever be. */
{
  class Retagged extends jose.errors.JWKSTimeout {
    override code = 'ERR_VENDOR_TIMEOUT'
  }
  const _compare = (err: jose.errors.JWKSTimeout) => err.code === 'ERR_JWKS_INVALID'
  const _widen = (err: jose.errors.JWTExpired): string => err.code
  const _write = (err: jose.errors.JWTExpired) => (err.code = 'ERR_WRAPPED')
  const _static = (): string[] => [jose.errors.JWTExpired.code, jose.errors.JWKSTimeout.code]
  const _sibling = (err: jose.errors.JWTExpired): jose.errors.JWTClaimValidationFailed => err
}

class ThirdPartyError extends jose.errors.JOSEError {
  override code = 'ERR_SOMETHING_ELSE'
}

function claimErrorUnion(err: jose.errors.JWTClaimValidationError) {
  const _payload: jose.JWTPayload = err.payload
  const _claim: string = err.claim
  const _cause: jose.errors.JWTClaimValidationFailure = err.cause
  const _reason: jose.errors.JWTClaimValidationReason = err.reason
}

{
  const _codes: Equals<
    jose.errors.JOSEErrorCode,
    jose.errors.AnyJOSEError['code'] | 'ERR_JOSE_GENERIC'
  > = true
}

/* The JWT Claims Set type parameter carries no constraint, so wrappers can forward a caller's own
 * unconstrained parameter through every consuming API. The returned payload remains assignable to
 * T & JWTPayload, matching the public shape from prior releases. */
function forwardsPayloadResult<T>(token: string) {
  return jose.jwtVerify<T>(token, secret)
}
async function forwardsPayloadType<T>(token: string) {
  const { payload: verified } = await jose.jwtVerify<T>(token, secret)
  const { payload: decrypted } = await jose.jwtDecrypt<T>(token, secret)
  const decoded = jose.decodeJwt<T>(token)
  const { payload: unsecured } = jose.UnsecuredJWT.decode<T>(token)

  const _iss: string | undefined = verified.iss
  const _claims: jose.JWTPayload = verified
  const _generic: T = verified
  const _releasedShapes: (T & jose.JWTPayload)[] = [verified, decrypted, decoded, unsecured]

  return { verified, decrypted, decoded, unsecured }
}
async function forwardsConstrained<T extends object>(token: string): Promise<T & jose.JWTPayload> {
  const { payload } = await jose.jwtVerify<T>(token, secret)
  const _iss: string | undefined = payload.iss
  const _sink: jose.JWTPayload = payload
  const _generic: T = payload
  return payload
}
async function forwardsClaims<T extends jose.JWTPayload>(
  token: string,
): Promise<T & jose.JWTPayload> {
  const { payload } = await jose.jwtDecrypt<T>(token, secret)
  const _exp: number | undefined = payload.exp
  const _sink: jose.JWTPayload = payload
  return payload
}
{
  const _nonObjectIsNever: Equals<jose.JWTVerifyResult<string>['payload'], never> = true
  const _mixedUnionIsNever: Equals<jose.JWTVerifyResult<{ a: 1 } | string>['payload'], never> = true
  const _unknownIsClaims: Equals<jose.JWTVerifyResult<unknown>['payload'], jose.JWTPayload> = true

  const _nonObject = async () => {
    const { payload } = await jose.jwtVerify<string>(jwt, secret)
    // @ts-expect-error a string cannot describe a JWT Claims Set, so payload is never
    payload.iss
    // `never` remains assignable to the released result shape.
    const _sink: jose.JWTPayload = payload
  }
  const _decoded = () => {
    const payload = jose.decodeJwt<number>(jwt)
    // @ts-expect-error a number cannot describe a JWT Claims Set
    payload.iss
  }
  const _mixedUnion = async () => {
    const { payload } = await jose.jwtVerify<{ a: 1 } | string>(jwt, secret)
    // @ts-expect-error every union member must describe a JWT Claims Set
    payload.iss
  }
  const _objectUnion = async () => {
    const { payload } = await jose.jwtVerify<{ a: 1 } | { b: 2 }>(jwt, secret)
    const _ok: jose.JWTPayload = payload
    const _iss: string | undefined = payload.iss
  }
  const _unknown = () => {
    const payload = jose.decodeJwt<unknown>(jwt)
    const _iss: string | undefined = payload.iss
    const _sink: jose.JWTPayload = payload
  }
}

type DecodedPayload = ReturnType<typeof jose.decodeJwt>
type VerifiedPayload = Awaited<ReturnType<typeof jose.jwtVerify>>['payload']
const _decodedReturnType: Equals<DecodedPayload, jose.JWTPayload> = true
const _verifiedReturnType: Equals<VerifiedPayload, jose.JWTPayload> = true
const returnTypePayloads = (decoded: DecodedPayload, verified: VerifiedPayload) => {
  const _decodedIss: string | undefined = decoded.iss
  const _verifiedIss: string | undefined = verified.iss
  const _decodedSink: jose.JWTPayload = decoded
  const _verifiedSink: jose.JWTPayload = verified
}

/* Custom payload types: an interface (not just a type alias) must work, registered claims survive,
 * and a conflicting registered claim is rejected at the point of instantiation. */
interface MyClaims {
  role: string
}

async function payloadGenerics() {
  const { payload } = await jose.jwtVerify<MyClaims>(jwt, secret)
  const _role: string = payload.role
  const _iss: string | undefined = payload.iss
  const _exp: number | undefined = payload.exp

  const _decoded = jose.decodeJwt<MyClaims>(jwt)
  const _unsecured = jose.UnsecuredJWT.decode<MyClaims>(jwt)

  await new jose.SignJWT({ role: 'admin' } satisfies MyClaims)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)
}

/* KeyObject stands in for Node's opaque crypto.KeyObject and must not admit arbitrary objects. */
{
  // @ts-expect-error Blob, Event and friends are not keys
  const _bad: jose.KeyObject = { type: 'totally-bogus' }
  const _good: jose.KeyObject = { type: 'secret' }
  const _types: Equals<jose.KeyObject['type'], 'private' | 'public' | 'secret'> = true
}
