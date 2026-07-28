// Type-level regression tests. Nothing here runs; the assertion is that `tsc -p test-d` compiles.
//
// Positive assertions use Equals<A, B>, which fails to compile unless the two types are mutually
// assignable. Negative assertions use @ts-expect-error, which fails to compile when the error it
// claims goes away. Run via `npm run typecheck:types`.
import * as jose from 'jose'
import { createPrivateKey } from 'node:crypto'

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
  type _Algs = jose.JWSAlgorithm | jose.JWEKeyManagementAlgorithm | jose.JWEContentEncryptionAlgorithm
  type _JwksFns = jose.RemoteJWKSet | jose.LocalJWKSet
}

/* JWK must satisfy the implicit index signature of @types/node's JsonWebKey, otherwise round
 * tripping a key through node:crypto does not compile. */
async function nodeInterop() {
  const jwk = await jose.exportJWK(cryptoKey)
  return createPrivateKey({ key: jwk, format: 'jwk' })
}

/* AnyJWK is narrowable on kty; JWK deliberately is not. */
function narrowJwk(jwk: jose.AnyJWK) {
  if (jwk.kty === 'EC') return jwk.x + jwk.y
  if (jwk.kty === 'RSA') return jwk.n + jwk.e
  if (jwk.kty === 'OKP') return jwk.x
  if (jwk.kty === 'AKP') return jwk.pub
  return jwk.k
}

/* Algorithm unions give autocompletion without narrowing the accepted inputs. */
{
  const _fromString: jose.JWSAlgorithm = anyString
  const _toString: string = 'ES256' satisfies jose.JWSAlgorithm
  const _list: jose.JWSAlgorithm[] = [anyString, 'ES256']
  const _opts: jose.VerifyOptions = { algorithms: [anyString, 'ES256'] }
}

/* The "jwk" Header Parameter accepts every public JWK member, and rejects the secret ones. */
{
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
  const _fresh: boolean = remote.fresh
  const _reload: Promise<void> = remote.reload()
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

class ThirdPartyError extends jose.errors.JOSEError {
  override code = 'ERR_SOMETHING_ELSE'
}

function claimErrorUnion(err: jose.errors.JWTClaimValidationError) {
  const _payload: jose.JWTPayload = err.payload
  const _claim: string = err.claim
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
}
