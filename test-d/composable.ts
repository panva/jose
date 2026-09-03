// Type-level coverage for every additive algorithm catalog and composable public entry point.
import * as jose from 'jose'
import * as jws from 'jose/algorithms/jws'
import type { JWSAlgorithmFactory } from 'jose/algorithms/jws'
// @ts-expect-error capability plumbing remains internal until custom algorithms are supported.
import type { AlgorithmFactory, JWSAlgorithmCapability } from 'jose/algorithms/jws'
import * as jwe from 'jose/algorithms/jwe'
import type { JWEAlgorithmFactory, JWEKeyManagementFactory } from 'jose/algorithms/jwe'
import * as enc from 'jose/algorithms/jwe/enc'
import type { JWEContentEncryptionFactory } from 'jose/algorithms/jwe/enc'
import * as zip from 'jose/algorithms/jwe/zip'
import type { JWECompressionFactory } from 'jose/algorithms/jwe/zip'
import * as keyAlgorithms from 'jose/algorithms/key'
import type { KeyAlgorithmFactory } from 'jose/algorithms/key'
import { composeSignJWT } from 'jose/composable/jwt/sign'
import { composeJwtVerify } from 'jose/composable/jwt/verify'
import { composeEncryptJWT } from 'jose/composable/jwt/encrypt'
import { composeJwtDecrypt } from 'jose/composable/jwt/decrypt'
import { composeCompactSign } from 'jose/composable/jws/compact/sign'
import { composeCompactVerify } from 'jose/composable/jws/compact/verify'
import { composeFlattenedSign } from 'jose/composable/jws/flattened/sign'
import { composeFlattenedVerify } from 'jose/composable/jws/flattened/verify'
import { composeGeneralSign } from 'jose/composable/jws/general/sign'
import { composeGeneralVerify } from 'jose/composable/jws/general/verify'
import { composeCompactEncrypt } from 'jose/composable/jwe/compact/encrypt'
import { composeCompactDecrypt } from 'jose/composable/jwe/compact/decrypt'
import { composeFlattenedEncrypt } from 'jose/composable/jwe/flattened/encrypt'
import { composeFlattenedDecrypt } from 'jose/composable/jwe/flattened/decrypt'
import { composeGeneralEncrypt } from 'jose/composable/jwe/general/encrypt'
import { composeGeneralDecrypt } from 'jose/composable/jwe/general/decrypt'
import type { ComposedCompactJWEHeader } from 'jose/composable/jwe/compact/decrypt'
import type { ComposedJWEHeader } from 'jose/composable/jwe/flattened/encrypt'
import { composeEmbeddedJWK } from 'jose/composable/jwk/embedded'
import { composeLocalJWKSet } from 'jose/composable/jwks/local'
import { composeRemoteJWKSet } from 'jose/composable/jwks/remote'
import { composeKeyImport } from 'jose/composable/key/import'
import { composeGenerateKeyPair } from 'jose/composable/key/generate/keypair'
import { composeGenerateSecret } from 'jose/composable/key/generate/secret'

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never
type SuggestedAlgorithm<Selected extends string> = Selected | (string & {})

/* Selected headers retain standard JOSE member types alongside their open extension members. */
{
  type JWSHeader = jws.SelectedJWSHeaderParameters<'ES256'>
  type CompactJWSHeader = jws.SelectedCompactJWSHeaderParameters<'ES256'>
  type JWTHeader = jws.SelectedJWTHeaderParameters<'ES256'>
  type JWEFactories = readonly [typeof jwe.dir, typeof enc.A256GCM, typeof zip.DEF]
  type JWEHeader = ComposedJWEHeader<JWEFactories>
  type CompactJWEHeader = ComposedCompactJWEHeader<JWEFactories>

  const _jwsKid: Equals<JWSHeader['kid'], string | undefined> = true
  const _jwsCrit: Equals<JWSHeader['crit'], string[] | undefined> = true
  const _compactJwsX5t: Equals<CompactJWSHeader['x5t'], string | undefined> = true
  const _jwtB64: Equals<JWTHeader['b64'], boolean | undefined> = true
  const _jweKid: Equals<JWEHeader['kid'], string | undefined> = true
  const _jweCrit: Equals<JWEHeader['crit'], string[] | undefined> = true
  const _compactJweX5t: Equals<CompactJWEHeader['x5t'], string | undefined> = true
  const _jwsExtension: Equals<JWSHeader['urn:example:jws'], unknown> = true
  const _jweExtension: Equals<JWEHeader['urn:example:jwe'], unknown> = true
}

declare const token: string
declare const flattenedJws: jose.FlattenedJWSInput
declare const generalJws: jose.GeneralJWSInput
declare const flattenedJwe: jose.FlattenedJWE
declare const generalJwe: jose.GeneralJWE
declare const bytes: Uint8Array
declare const key: jose.CryptoKey
declare const url: URL
declare const anyString: string
declare const foreignJws: JWSAlgorithmFactory<'ES256'>
declare const foreignKm: JWEKeyManagementFactory<'dir'>
declare const foreignEnc: JWEContentEncryptionFactory<'A256GCM'>
declare const foreignZip: JWECompressionFactory<'DEF'>
declare const foreignKey: KeyAlgorithmFactory<'ES256'>
declare const broadJweFactory: JWEAlgorithmFactory
declare const eitherJwsFactory: JWSAlgorithmFactory<'ES256' | 'HS256'>

/* Factory return types preserve identifiers, categories, and the structural public contract. */
{
  const jwsCapability = jws.ES256()
  const kmCapability = jwe.RSA_OAEP_256()
  const encCapability = enc.A256GCM()
  const zipCapability = zip.DEF()
  const keyCapability = keyAlgorithms.ES256()
  const _jwsCategory: Equals<typeof jwsCapability.category, 'jws'> = true
  const _jwsAlgorithm: Equals<typeof jwsCapability.algorithm, 'ES256'> = true
  const _kmCategory: Equals<typeof kmCapability.category, 'jwe-key-management'> = true
  const _kmAlgorithm: Equals<typeof kmCapability.algorithm, 'RSA-OAEP-256'> = true
  const _encCategory: Equals<typeof encCapability.category, 'jwe-content-encryption'> = true
  const _encAlgorithm: Equals<typeof encCapability.algorithm, 'A256GCM'> = true
  const _zipCategory: Equals<typeof zipCapability.category, 'jwe-compression'> = true
  const _zipAlgorithm: Equals<typeof zipCapability.algorithm, 'DEF'> = true
  const _keyCategory: Equals<typeof keyCapability.category, 'key'> = true
  const _keyAlgorithm: Equals<typeof keyCapability.algorithm, 'ES256'> = true
}

/* Specific factory aliases deliberately reserve custom identifiers for a future extension API. */
{
  // @ts-expect-error custom JWS identifiers are not built-in JWS factories.
  type CustomJWSFactory = JWSAlgorithmFactory<'urn:example:custom-jws'>
  // @ts-expect-error custom JWE alg identifiers are not built-in key-management factories.
  type CustomKeyManagementFactory = JWEKeyManagementFactory<'urn:example:custom-km'>
  // @ts-expect-error custom JWE enc identifiers are not built-in content-encryption factories.
  type CustomContentEncryptionFactory = JWEContentEncryptionFactory<'urn:example:custom-enc'>
  // @ts-expect-error custom JWE zip identifiers are not built-in compression factories.
  type CustomCompressionFactory = JWECompressionFactory<'urn:example:custom-zip'>
  // @ts-expect-error custom identifiers are not built-in key utility factories.
  type CustomKeyFactory = KeyAlgorithmFactory<'urn:example:custom-key'>
}

/* JWS composers preserve fluent APIs and suggest the selected algorithms without closing strings. */
{
  const SignJWT = composeSignJWT(jws.ES256, jws.HS256)
  const CompactSign = composeCompactSign(jws.ES256, jws.HS256)
  const FlattenedSign = composeFlattenedSign(jws.ES256, jws.HS256)
  const GeneralSign = composeGeneralSign(jws.ES256, jws.HS256)
  const _jwtConstructor: Equals<
    ConstructorParameters<typeof SignJWT>,
    [payload?: jose.JWTPayload]
  > = true
  const _compactConstructor: Equals<
    ConstructorParameters<typeof CompactSign>,
    [payload: Uint8Array]
  > = true

  class DerivedSignJWT extends SignJWT {}
  new DerivedSignJWT().setProtectedHeader({ alg: 'ES256' }).sign(key)

  new SignJWT({ sub: 'alice' }).setIssuer('issuer').setProtectedHeader({ alg: 'ES256' }).sign(key)
  new SignJWT().setProtectedHeader({ alg: 'HS256' }).sign(bytes)
  new CompactSign(bytes).setProtectedHeader({ alg: 'ES256' }).sign(key)
  new FlattenedSign(bytes)
    .setProtectedHeader({ alg: 'HS256' })
    .setUnprotectedHeader({ kid: 'one' })
    .sign(bytes)
  new GeneralSign(bytes)
    .addSignature(key)
    .setProtectedHeader({ alg: 'ES256' })
    .addSignature(bytes)
    .setProtectedHeader({ alg: 'HS256' })
    .done()
    .sign()

  new SignJWT().setProtectedHeader({ alg: 'RS256' })
  new CompactSign(bytes).setProtectedHeader({ alg: anyString })
  new FlattenedSign(bytes).setProtectedHeader({ alg: anyString })
  new GeneralSign(bytes).addSignature(key).setProtectedHeader({ alg: anyString })
  const widenedHeader = { alg: 'ES256' }
  new SignJWT().setProtectedHeader(widenedHeader)
  // @ts-expect-error algorithm identifiers must remain strings.
  new SignJWT().setProtectedHeader({ alg: 256 })
  // @ts-expect-error an ES256-only signer does not accept raw secret bytes.
  new (composeSignJWT(jws.ES256))().setProtectedHeader({ alg: 'ES256' }).sign(bytes)
}

/* Every composed JWS consumer has direct-key, resolver, and open suggested-algorithm overloads. */
async function jwsConsumers() {
  const compactVerify = composeCompactVerify(jws.ES256, jws.HS256)
  const flattenedVerify = composeFlattenedVerify(jws.ES256, jws.HS256)
  const generalVerify = composeGeneralVerify(jws.ES256, jws.HS256)
  const jwtVerify = composeJwtVerify(jws.ES256, jws.HS256)
  const either: jose.KeyInput | (() => Uint8Array) = Math.random() ? key : () => bytes

  const directCompact = await compactVerify(token, key, { algorithms: ['ES256', 'HS256'] })
  const directFlattened = await flattenedVerify(flattenedJws, key)
  const directGeneral = await generalVerify(generalJws, key)
  const directJwt = await jwtVerify<{ role: string }>(token, key)
  // @ts-expect-error `key` is only returned for resolver calls.
  directCompact.key
  // @ts-expect-error `key` is only returned for resolver calls.
  directFlattened.key
  // @ts-expect-error `key` is only returned for resolver calls.
  directGeneral.key
  // @ts-expect-error `key` is only returned for resolver calls.
  directJwt.key
  const _payload: Equals<typeof directJwt.payload.role, string> = true
  const _jwtAlg: Equals<
    typeof directJwt.protectedHeader.alg,
    SuggestedAlgorithm<'ES256' | 'HS256'>
  > = true
  const _jwtOpenAlg: typeof directJwt.protectedHeader.alg = anyString

  const resolveBytes = async () => bytes
  await compactVerify(token, async (protectedHeader) => {
    const _kid: string | undefined = protectedHeader.kid
    return bytes
  })
  const compact = await compactVerify(token, resolveBytes)
  const flattened = await flattenedVerify(flattenedJws, resolveBytes)
  const general = await generalVerify(generalJws, resolveBytes)
  const jwt = await jwtVerify(token, resolveBytes)
  const _1: Equals<typeof compact.key, Uint8Array> = true
  const _2: Equals<typeof flattened.key, Uint8Array> = true
  const _3: Equals<typeof general.key, Uint8Array> = true
  const _4: Equals<typeof jwt.key, Uint8Array> = true
  const _5: Equals<typeof compact.protectedHeader.alg, SuggestedAlgorithm<'ES256' | 'HS256'>> = true
  const _compactOpenAlg: typeof compact.protectedHeader.alg = anyString

  const compactForwarded = await compactVerify(token, either)
  const flattenedForwarded = await flattenedVerify(flattenedJws, either)
  const generalForwarded = await generalVerify(generalJws, either)
  const jwtForwarded = await jwtVerify(token, either)
  type ForwardedKey = jose.CryptoKey | Uint8Array | undefined
  const _6: Equals<typeof compactForwarded.key, ForwardedKey> = true
  const _7: Equals<typeof flattenedForwarded.key, ForwardedKey> = true
  const _8: Equals<typeof generalForwarded.key, ForwardedKey> = true
  const _9: Equals<typeof jwtForwarded.key, ForwardedKey> = true

  await compactVerify(token, key, { algorithms: ['RS256', anyString] })
  await flattenedVerify(flattenedJws, key, { algorithms: [anyString] })
  await generalVerify(generalJws, key, { algorithms: [anyString] })
  await jwtVerify(token, key, { algorithms: [anyString] })
  const readonlyOptions = { algorithms: ['ES256'] } as const
  await compactVerify(token, key, readonlyOptions)
  // @ts-expect-error allowed algorithm identifiers must remain strings.
  await compactVerify(token, key, { algorithms: [256] })
}

/* JWE producer headers suggest selected alg, enc, and zip values without closing strings. */
{
  const EncryptJWT = composeEncryptJWT(jwe.dir, jwe.RSA_OAEP_256, enc.A256GCM, zip.DEF)
  const CompactEncrypt = composeCompactEncrypt(jwe.dir, jwe.RSA_OAEP_256, enc.A256GCM, zip.DEF)
  const FlattenedEncrypt = composeFlattenedEncrypt(jwe.dir, jwe.RSA_OAEP_256, enc.A256GCM, zip.DEF)
  const GeneralEncrypt = composeGeneralEncrypt(jwe.dir, jwe.RSA_OAEP_256, enc.A256GCM, zip.DEF)
  const _jwtConstructor: Equals<
    ConstructorParameters<typeof EncryptJWT>,
    [payload?: jose.JWTPayload]
  > = true
  const _compactConstructor: Equals<
    ConstructorParameters<typeof CompactEncrypt>,
    [plaintext: Uint8Array]
  > = true

  class DerivedCompactEncrypt extends CompactEncrypt {}
  new DerivedCompactEncrypt(bytes).setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })

  new EncryptJWT({ sub: 'alice' })
    .setIssuer('issuer')
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', zip: 'DEF' })
    .setInitializationVector(bytes)
    .encrypt(bytes)
  new CompactEncrypt(bytes)
    .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
    .setContentEncryptionKey(bytes)
    .encrypt(key)
  new FlattenedEncrypt(bytes)
    .setProtectedHeader({ enc: 'A256GCM' })
    .setUnprotectedHeader({ alg: 'dir' })
    .setAdditionalAuthenticatedData(bytes)
    .encrypt(bytes)
  new GeneralEncrypt(bytes)
    .setProtectedHeader({ enc: 'A256GCM', zip: 'DEF' })
    .addRecipient(bytes)
    .setUnprotectedHeader({ alg: 'dir' })
    .done()
    .encrypt()

  new EncryptJWT().setProtectedHeader({ alg: 'dir', enc: 'A128GCM' })
  new CompactEncrypt(bytes).setProtectedHeader({ alg: 'A128KW', enc: 'A256GCM' })
  new FlattenedEncrypt(bytes).setProtectedHeader({ alg: anyString, enc: anyString, zip: anyString })
  new GeneralEncrypt(bytes).setProtectedHeader({ alg: anyString, enc: anyString, zip: anyString })
  const widenedHeader = { alg: 'dir', enc: 'A256GCM' }
  new EncryptJWT().setProtectedHeader(widenedHeader)
  // @ts-expect-error algorithm identifiers must remain strings.
  new EncryptJWT().setProtectedHeader({ alg: 'dir', enc: 256 })
  const WithoutCompression = composeEncryptJWT(jwe.dir, enc.A256GCM)
  new WithoutCompression().setProtectedHeader({ alg: 'dir', enc: 'A256GCM', zip: 'DEF' })
  new WithoutCompression().setProtectedHeader({ alg: anyString, enc: anyString, zip: anyString })
}

/* Every composed JWE consumer suggests selected options/results and infers resolver keys. */
async function jweConsumers() {
  const compactDecrypt = composeCompactDecrypt(jwe.dir, enc.A256GCM, zip.DEF)
  const flattenedDecrypt = composeFlattenedDecrypt(jwe.dir, enc.A256GCM, zip.DEF)
  const generalDecrypt = composeGeneralDecrypt(jwe.dir, enc.A256GCM, zip.DEF)
  const jwtDecrypt = composeJwtDecrypt(jwe.dir, enc.A256GCM, zip.DEF)
  const either: jose.KeyInput | (() => Uint8Array) = Math.random() ? key : () => bytes
  const options = {
    keyManagementAlgorithms: ['dir'],
    contentEncryptionAlgorithms: ['A256GCM'],
  } as const

  const directCompact = await compactDecrypt(token, bytes, options)
  const directFlattened = await flattenedDecrypt(flattenedJwe, bytes)
  const directGeneral = await generalDecrypt(generalJwe, bytes)
  const directJwt = await jwtDecrypt<{ role: string }>(token, bytes)
  // @ts-expect-error `key` is only returned for resolver calls.
  directCompact.key
  // @ts-expect-error `key` is only returned for resolver calls.
  directFlattened.key
  // @ts-expect-error `key` is only returned for resolver calls.
  directGeneral.key
  // @ts-expect-error `key` is only returned for resolver calls.
  directJwt.key
  const _alg: Equals<typeof directCompact.protectedHeader.alg, SuggestedAlgorithm<'dir'>> = true
  const _enc: Equals<typeof directCompact.protectedHeader.enc, SuggestedAlgorithm<'A256GCM'>> = true
  const _zip: Equals<
    typeof directCompact.protectedHeader.zip,
    SuggestedAlgorithm<'DEF'> | undefined
  > = true
  const _openAlg: typeof directCompact.protectedHeader.alg = anyString
  const _openEnc: typeof directCompact.protectedHeader.enc = anyString
  const _openZip: typeof directCompact.protectedHeader.zip = anyString
  const _payload: Equals<typeof directJwt.payload.role, string> = true

  const resolveBytes = async () => bytes
  await compactDecrypt(token, async (protectedHeader) => {
    const _kid: string | undefined = protectedHeader.kid
    return bytes
  })
  const compact = await compactDecrypt(token, resolveBytes)
  const flattened = await flattenedDecrypt(flattenedJwe, resolveBytes)
  const general = await generalDecrypt(generalJwe, resolveBytes)
  const jwt = await jwtDecrypt(token, resolveBytes)
  const _1: Equals<typeof compact.key, Uint8Array> = true
  const _2: Equals<typeof flattened.key, Uint8Array> = true
  const _3: Equals<typeof general.key, Uint8Array> = true
  const _4: Equals<typeof jwt.key, Uint8Array> = true

  const compactForwarded = await compactDecrypt(token, either)
  const flattenedForwarded = await flattenedDecrypt(flattenedJwe, either)
  const generalForwarded = await generalDecrypt(generalJwe, either)
  const jwtForwarded = await jwtDecrypt(token, either)
  type ForwardedKey = jose.CryptoKey | Uint8Array | undefined
  const _5: Equals<typeof compactForwarded.key, ForwardedKey> = true
  const _6: Equals<typeof flattenedForwarded.key, ForwardedKey> = true
  const _7: Equals<typeof generalForwarded.key, ForwardedKey> = true
  const _8: Equals<typeof jwtForwarded.key, ForwardedKey> = true

  await compactDecrypt(token, bytes, {
    keyManagementAlgorithms: ['RSA-OAEP', anyString],
    contentEncryptionAlgorithms: ['A128GCM', anyString],
  })
  await flattenedDecrypt(flattenedJwe, bytes, {
    keyManagementAlgorithms: [anyString],
    contentEncryptionAlgorithms: [anyString],
  })
  await generalDecrypt(generalJwe, bytes, {
    keyManagementAlgorithms: [anyString],
    contentEncryptionAlgorithms: [anyString],
  })
  await jwtDecrypt(token, bytes, {
    keyManagementAlgorithms: [anyString],
    contentEncryptionAlgorithms: [anyString],
  })
  // @ts-expect-error allowed algorithm identifiers must remain strings.
  await compactDecrypt(token, bytes, { keyManagementAlgorithms: [256] })
}

/* JWE catalog coverage spans direct, RSA, ECDH, AES-KW, AES-GCM-KW, PBES2, GCM, CBC-HMAC, and DEF. */
{
  const allFamilies = composeCompactEncrypt(
    jwe.dir,
    jwe.RSA_OAEP,
    jwe.RSA_OAEP_256,
    jwe.RSA_OAEP_384,
    jwe.RSA_OAEP_512,
    jwe.ECDH_ES,
    jwe.ECDH_ES_A128KW,
    jwe.ECDH_ES_A192KW,
    jwe.ECDH_ES_A256KW,
    jwe.A128KW,
    jwe.A192KW,
    jwe.A256KW,
    jwe.A128GCMKW,
    jwe.A192GCMKW,
    jwe.A256GCMKW,
    jwe.PBES2_HS256_A128KW,
    jwe.PBES2_HS384_A192KW,
    jwe.PBES2_HS512_A256KW,
    enc.A128GCM,
    enc.A192GCM,
    enc.A256GCM,
    enc.A128CBC_HS256,
    enc.A192CBC_HS384,
    enc.A256CBC_HS512,
    zip.DEF,
  )
  new allFamilies(bytes).setProtectedHeader({
    alg: 'PBES2-HS512+A256KW',
    enc: 'A256CBC-HS512',
    zip: 'DEF',
  })
}

/* JWK/JWKS headers stay open while key utility algorithm arguments remain selection-safe. */
async function utilities() {
  const embedded = composeEmbeddedJWK(jws.ES256, jws.PS256)
  const createLocal = composeLocalJWKSet(jws.ES256, jws.PS256)
  const createRemote = composeRemoteJWKSet(jws.ES256, jws.PS256)
  const local = createLocal({ keys: [] })
  const remote = createRemote(url)
  const selectedToken = { payload: '', signature: '' }
  const _embedded: jose.CryptoKey = await embedded({ alg: 'ES256' }, selectedToken)
  const _local: jose.CryptoKey = await local({ alg: 'PS256' }, selectedToken)
  const _remote: jose.CryptoKey = await remote({ alg: 'ES256' }, selectedToken)
  const _embeddedOpen: jose.CryptoKey = await embedded({ alg: anyString }, selectedToken)
  const _localOpen: jose.CryptoKey = await local({ alg: anyString }, selectedToken)
  const _remoteOpen: jose.CryptoKey = await remote({ alg: anyString }, selectedToken)
  const _jwks: jose.JSONWebKeySet | undefined = remote.jwks()
  const _fresh: boolean = remote.fresh

  const imports = composeKeyImport(keyAlgorithms.ES256, keyAlgorithms.dir, keyAlgorithms.A256GCM)
  await imports.importSPKI('pem', 'ES256')
  await imports.importJWK({ kty: 'oct', k: 'k' }, 'dir')
  // @ts-expect-error the import composer was not given RSA-OAEP.
  await imports.importPKCS8('pem', 'RSA-OAEP')

  const generatePair = composeGenerateKeyPair(
    keyAlgorithms.ES256,
    keyAlgorithms.RSA_OAEP_256,
    keyAlgorithms.ECDH_ES,
  )
  const generateSecret = composeGenerateSecret(
    keyAlgorithms.HS256,
    keyAlgorithms.A128KW,
    keyAlgorithms.A256GCM,
    keyAlgorithms.A128CBC_HS256,
  )
  const _pair: jose.GenerateKeyPairResult = await generatePair('RSA-OAEP-256')
  await generatePair('ECDH-ES')
  const _hmac: jose.CryptoKey = await generateSecret('HS256')
  const _gcm: jose.CryptoKey = await generateSecret('A256GCM')
  const _content: Uint8Array = await generateSecret('A128CBC-HS256')
  // @ts-expect-error A256KW was not selected.
  await generateSecret('A256KW')
}

/* Structurally compatible factories from another package copy keep their literal narrowing. */
{
  const ForeignSignJWT = composeSignJWT(foreignJws)
  const ForeignEncryptJWT = composeEncryptJWT(foreignKm, foreignEnc, foreignZip)
  const ForeignKeyImport = composeKeyImport(foreignKey)
  new ForeignSignJWT().setProtectedHeader({ alg: 'ES256' })
  new ForeignEncryptJWT().setProtectedHeader({
    alg: 'dir',
    enc: 'A256GCM',
    zip: 'DEF',
  })
  ForeignKeyImport.importJWK({ kty: 'EC' }, 'ES256')
}

/* Invalid, duplicate, and widened selections are rejected before an API can lose precision. */
{
  // @ts-expect-error JWS composers require at least one factory.
  composeSignJWT()
  // @ts-expect-error JWS composers reject JWE factories.
  composeSignJWT(jwe.dir)
  // @ts-expect-error duplicate identifiers are rejected.
  composeSignJWT(jws.ES256, jws.ES256)
  // @ts-expect-error an overlapping factory union may repeat ES256 at runtime.
  composeSignJWT(jws.ES256, eitherJwsFactory)
  // @ts-expect-error JWE composers require a content-encryption factory.
  composeEncryptJWT(jwe.dir)
  // @ts-expect-error JWE composers require a key-management factory.
  composeEncryptJWT(enc.A256GCM)
  // @ts-expect-error duplicate JWE identifiers are rejected.
  composeEncryptJWT(jwe.dir, enc.A256GCM, jwe.dir)
  // @ts-expect-error one broad factory does not prove distinct key-management and enc selections.
  composeEncryptJWT(broadJweFactory)
  // @ts-expect-error symmetric HMAC cannot generate an asymmetric key pair.
  composeGenerateKeyPair(keyAlgorithms.HS256)
  // @ts-expect-error direct key management cannot generate an asymmetric key pair.
  composeGenerateKeyPair(keyAlgorithms.dir)
  // @ts-expect-error AES-KW cannot generate an asymmetric key pair.
  composeGenerateKeyPair(keyAlgorithms.A128KW)
  // @ts-expect-error AES-GCM-KW cannot generate an asymmetric key pair.
  composeGenerateKeyPair(keyAlgorithms.A128GCMKW)
  // @ts-expect-error PBES2 cannot generate an asymmetric key pair.
  composeGenerateKeyPair(keyAlgorithms.PBES2_HS256_A128KW)
  // @ts-expect-error asymmetric ES256 cannot generate a secret.
  composeGenerateSecret(keyAlgorithms.ES256)
  // @ts-expect-error key composers reject operation factories.
  composeKeyImport(jws.ES256)
  // @ts-expect-error key composers reject operation factories.
  composeGenerateKeyPair(jwe.RSA_OAEP_256)
  // @ts-expect-error key composers reject operation factories.
  composeGenerateSecret(enc.A256GCM)
  // @ts-expect-error operation composers reject key factories.
  composeSignJWT(keyAlgorithms.ES256)
  // @ts-expect-error operation composers reject key factories.
  composeEncryptJWT(keyAlgorithms.dir, enc.A256GCM)
  // @ts-expect-error Embedded JWK resolution requires asymmetric JWS algorithms.
  composeEmbeddedJWK(jws.HS256)
  // @ts-expect-error key composers require at least one key factory.
  composeKeyImport()
  // @ts-expect-error duplicate key identifiers are rejected.
  composeKeyImport(keyAlgorithms.ES256, keyAlgorithms.ES256)

  const malformed = () => ({ category: 'jws', algorithm: 'ES256' }) as const
  // Cross-package typing is deliberately metadata-only. Runtime validation still
  // rejects this malformed capability before the composed API is returned.
  composeSignJWT(malformed)

  const jwsTuple = [jws.ES256, jws.HS256] as const
  const jweTuple = [jwe.dir, enc.A256GCM, zip.DEF] as const
  const keyTuple = [keyAlgorithms.Ed25519, keyAlgorithms.ES256] as const
  composeSignJWT(...jwsTuple)
  composeEncryptJWT(...jweTuple)
  composeGenerateKeyPair(...keyTuple)
  const widenedJws: readonly JWSAlgorithmFactory[] = jwsTuple
  const widenedJwe: readonly JWEAlgorithmFactory[] = jweTuple
  const widenedKey: readonly KeyAlgorithmFactory[] = keyTuple
  // @ts-expect-error a widened array no longer proves a non-empty JWS selection.
  composeSignJWT(...widenedJws)
  // @ts-expect-error a widened array no longer proves a non-empty mixed JWE selection.
  composeEncryptJWT(...widenedJwe)
  // @ts-expect-error a widened array no longer proves a non-empty key selection.
  composeKeyImport(...widenedKey)
}

/* The compatibility barrel stays open to runtime strings and retains its existing classes. */
{
  new jose.SignJWT().setProtectedHeader({ alg: anyString }).sign(bytes)
  new jose.EncryptJWT().setProtectedHeader({ alg: anyString, enc: anyString }).encrypt(bytes)
  const _verify: jose.VerifyOptions = { algorithms: [anyString] }
  const _decrypt: jose.DecryptOptions = {
    keyManagementAlgorithms: [anyString],
    contentEncryptionAlgorithms: [anyString],
  }
}
