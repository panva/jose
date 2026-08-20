// Package-facing SD-JWT type regressions. Nothing here runs; `tsc -p test-d` is the assertion.
import type {
  CompactJWSHeaderParameters,
  CryptoKey,
  JWSAlgorithm,
  JWTPayload,
  JWTHeaderParameters,
} from 'jose'
import * as sdJwt from 'jose/sd-jwt'

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

declare const compact: string
declare const flattened: sdJwt.FlattenedSDJWT
declare const general: sdJwt.GeneralSDJWT
declare const issuerKey: CryptoKey
declare const holderKey: CryptoKey
declare const secret: Uint8Array
declare const anyAlgorithm: string
declare const verifyOptions: sdJwt.SDJWTVerifyOptions

type BrandedIssuerKey = CryptoKey & { readonly issuerKey: unique symbol }
declare const brandedIssuerKey: BrandedIssuerKey

const issuerResolver: sdJwt.SDJWTIssuerGetKey = () => issuerKey
const brandedIssuerResolver: sdJwt.SDJWTIssuerGetKey<BrandedIssuerKey> = () => brandedIssuerKey

/* All public SD-JWT types are reachable from the package subpath. */
type PublicTypes = [
  sdJwt.SDJWTSignature,
  sdJwt.SDJWTCredential,
  sdJwt.SDJWTDisclosure,
  sdJwt.SDJWTHolderSigningKey,
  sdJwt.SDJWTIssuerGetKey,
  sdJwt.SDJWTIssuerKey,
  sdJwt.SDJWTIssuerSigningKey,
  sdJwt.SDJWTKeyBinding,
  sdJwt.SDJWTReceiveOptions,
  sdJwt.FlattenedSDJWTVerifyResult,
  sdJwt.GeneralSDJWTVerifyResult,
  sdJwt.SDJWTHolderKeyResolver,
  sdJwt.SDJWTHolderVerificationKey,
  sdJwt.SDJWTKeyBindingPayload,
  sdJwt.SDJWTKeyBindingVerificationOptions,
  sdJwt.SDJWTKeyBindingVerifyResult,
  sdJwt.SDJWTVerifyOptions,
  sdJwt.SDJWTVerifyResult,
  sdJwt.FlattenedSDJWT,
  sdJwt.GeneralSDJWT,
  sdJwt.GeneralSDJWTSignature,
  sdJwt.ProduceSDJWT,
  sdJwt.SDJWT,
  sdJwt.SDJWTDecoyCount,
  sdJwt.SDJWTHashAlgorithm,
  sdJwt.SDJWTUnprotectedHeaderParameters,
]
const _publicTypes: PublicTypes | undefined = undefined

/* Issuer and Holder signing keys are asymmetric; issuer resolver output is normalized to a
 * CryptoKey and preserves a narrower CryptoKey subtype. */
{
  const _issuerVerificationKey: sdJwt.SDJWTIssuerKey = issuerKey
  const _issuerSigningKey: sdJwt.SDJWTIssuerSigningKey = issuerKey
  const _holderSigningKey: sdJwt.SDJWTHolderSigningKey = holderKey
  // @ts-expect-error issuer signature verification requires an asymmetric key
  const _issuerSecret: sdJwt.SDJWTIssuerKey = secret
  // @ts-expect-error issuer signing requires an asymmetric key
  const _issuerSigningSecret: sdJwt.SDJWTIssuerSigningKey = secret
  // @ts-expect-error Key Binding signing requires an asymmetric key
  const _holderSecret: sdJwt.SDJWTHolderSigningKey = secret
}

/* Key Binding accepts the public JWS algorithm type, including extension identifiers. Its holder
 * resolver sees the same compact protected-header shape as jwtVerify resolvers. */
{
  const _algorithmType: Equals<
    sdJwt.SDJWTKeyBindingVerificationOptions['algorithms'],
    JWSAlgorithm[]
  > = true
  const _policy: sdJwt.SDJWTKeyBindingVerificationOptions = {
    audience: 'https://verifier.example',
    nonce: 'nonce',
    algorithms: [anyAlgorithm, 'ES256'],
    maxTokenAge: '5 minutes',
  }
  const _holderResolver: sdJwt.SDJWTHolderKeyResolver = (protectedHeader) => {
    const _header: Equals<typeof protectedHeader, CompactJWSHeaderParameters> = true
    return holderKey
  }
}

/* The payload parameter remains unconstrained for generic wrappers, while known non-object shapes
 * collapse to never. `unknown` retains the default JWTPayload surface. */
{
  const _credentialNonObject: Equals<sdJwt.SDJWTCredential<string>['payload'], never> = true
  const _verifyNonObject: Equals<sdJwt.SDJWTVerifyResult<number>['payload'], never> = true
  const _flattenedMixed: Equals<
    sdJwt.FlattenedSDJWTVerifyResult<{ disclosed: true } | string>['payload'],
    never
  > = true
  const _generalUnknown: Equals<sdJwt.GeneralSDJWTVerifyResult<unknown>['payload'], JWTPayload> =
    true
  const _credentialUnknown: Equals<sdJwt.SDJWTCredential<unknown>['payload'], JWTPayload> = true
}

async function forwardsPayloadType<T>(key: sdJwt.SDJWTIssuerKey) {
  const received = await sdJwt.sdJwtReceive<T>(compact, key)
  const verified = await sdJwt.sdJwtVerify<T>(compact, key, { keyBinding: false })
  const _releasedShapes: (T & JWTPayload)[] = [received.payload, verified.payload]
  return { received, verified }
}

async function nonObjectPayloadIsUnusable() {
  const received = await sdJwt.sdJwtReceive<string>(compact, issuerKey)
  const verified = await sdJwt.sdJwtVerify<number>(compact, issuerKey, { keyBinding: false })
  // @ts-expect-error a string cannot describe an SD-JWT Claims Set
  received.payload.iss
  // @ts-expect-error a number cannot describe an SD-JWT Claims Set
  verified.payload.iss
}

/* Producer builders and Holder presentation methods preserve their serialization syntax. */
async function producerAndPresentationInference() {
  const compactProduced: string = await new sdJwt.SignSDJWT({ disclosed: true })
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuer('https://issuer.example')
    .setDisclosurePaths(['/disclosed'])
    .setHashAlgorithm('sha-256')
    .addDecoys('', 1)
    .sign(issuerKey)

  const flattenedProduced: sdJwt.FlattenedSDJWT = await new sdJwt.FlattenedSignSDJWT({
    disclosed: true,
  })
    .setUnprotectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/disclosed'])
    .sign(issuerKey)

  const generalProduced: sdJwt.GeneralSDJWT = await new sdJwt.GeneralSignSDJWT({
    disclosed: true,
  })
    .setDisclosurePaths(['/disclosed'])
    .addSignature(issuerKey)
    .setUnprotectedHeader({ alg: 'ES256' })
    .sign()

  const compactCredential = await sdJwt.sdJwtReceive<{ disclosed?: boolean }>(
    compactProduced,
    issuerKey,
  )
  const _compactHeader: JWTHeaderParameters = compactCredential.protectedHeader
  const _compactPresentation: string = await compactCredential.present(['/disclosed'])
  // @ts-expect-error static-key results do not expose a resolved key
  compactCredential.key

  const flattenedCredential = await sdJwt.flattenedSdJwtReceive(flattenedProduced, issuerKey)
  const _flattenedPresentation: sdJwt.FlattenedSDJWT = await flattenedCredential.present()
  // @ts-expect-error static-key results do not expose a resolved key
  flattenedCredential.key

  const generalCredential = await sdJwt.generalSdJwtReceive(generalProduced, issuerKey)
  const _generalPresentation: sdJwt.GeneralSDJWT = await generalCredential.present()
  // @ts-expect-error static-key results do not expose a resolved key
  generalCredential.key

  const _boundPresentation: string = await compactCredential
    .addKeyBinding(holderKey)
    .setPayload({ transaction_data: ['custom claim'] })
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience('https://verifier.example')
    .setNonce('nonce')
    .setIssuedAt()
    .present(['/disclosed'])
}

/* Dynamic resolver results require `key` and retain branded CryptoKey subtypes for all three
 * serializations. */
async function dynamicIssuerKeyInference() {
  const compactCredential = await sdJwt.sdJwtReceive(compact, brandedIssuerResolver)
  const flattenedCredential = await sdJwt.flattenedSdJwtReceive(flattened, brandedIssuerResolver)
  const generalCredential = await sdJwt.generalSdJwtReceive(general, brandedIssuerResolver)
  const _receiveCompact: Equals<typeof compactCredential.key, BrandedIssuerKey> = true
  const _receiveFlattened: Equals<typeof flattenedCredential.key, BrandedIssuerKey> = true
  const _receiveGeneral: Equals<typeof generalCredential.key, BrandedIssuerKey> = true

  const compactVerified = await sdJwt.sdJwtVerify(compact, brandedIssuerResolver, {
    keyBinding: false,
  })
  const flattenedVerified = await sdJwt.flattenedSdJwtVerify(flattened, brandedIssuerResolver, {
    keyBinding: false,
  })
  const generalVerified = await sdJwt.generalSdJwtVerify(general, brandedIssuerResolver, {
    keyBinding: false,
  })
  const _verifyCompact: Equals<typeof compactVerified.key, BrandedIssuerKey> = true
  const _verifyFlattened: Equals<typeof flattenedVerified.key, BrandedIssuerKey> = true
  const _verifyGeneral: Equals<typeof generalVerified.key, BrandedIssuerKey> = true

  // `keyBinding: false` removes the result property even for dynamic-key overloads.
  // @ts-expect-error forbidden Key Binding means there is no keyBinding result
  compactVerified.keyBinding
  // @ts-expect-error forbidden Key Binding means there is no keyBinding result
  flattenedVerified.keyBinding
  // @ts-expect-error forbidden Key Binding means there is no keyBinding result
  generalVerified.keyBinding
}

const keyBindingPolicy: sdJwt.SDJWTKeyBindingVerificationOptions = {
  audience: 'https://verifier.example',
  nonce: 'nonce',
  algorithms: ['ES256'],
  maxTokenAge: '5 minutes',
}

/* Literal Key Binding policies preserve required/forbidden result shapes. Broadly typed policies
 * keep the result optional. */
async function keyBindingResultInference() {
  const forbidden = await sdJwt.sdJwtVerify(compact, issuerKey, { keyBinding: false })
  const flattenedForbidden = await sdJwt.flattenedSdJwtVerify(flattened, issuerKey, {
    keyBinding: false,
  })
  const generalForbidden = await sdJwt.generalSdJwtVerify(general, issuerKey, {
    keyBinding: false,
  })
  // @ts-expect-error forbidden Key Binding means there is no keyBinding result
  forbidden.keyBinding
  // @ts-expect-error forbidden Key Binding means there is no keyBinding result
  flattenedForbidden.keyBinding
  // @ts-expect-error forbidden Key Binding means there is no keyBinding result
  generalForbidden.keyBinding
  // @ts-expect-error static-key results do not expose a resolved key
  forbidden.key
  // @ts-expect-error static-key results do not expose a resolved key
  flattenedForbidden.key
  // @ts-expect-error static-key results do not expose a resolved key
  generalForbidden.key

  const required = await sdJwt.sdJwtVerify(compact, issuerResolver, {
    keyBinding: keyBindingPolicy,
  })
  const flattenedRequired = await sdJwt.flattenedSdJwtVerify(flattened, issuerResolver, {
    keyBinding: keyBindingPolicy,
  })
  const generalRequired = await sdJwt.generalSdJwtVerify(general, issuerResolver, {
    keyBinding: keyBindingPolicy,
  })
  const _required: sdJwt.SDJWTKeyBindingVerifyResult = required.keyBinding
  const _flattenedRequired: sdJwt.SDJWTKeyBindingVerifyResult = flattenedRequired.keyBinding
  const _generalRequired: sdJwt.SDJWTKeyBindingVerifyResult = generalRequired.keyBinding
  const _resolvedKey: Equals<typeof required.key, CryptoKey> = true

  const broad = await sdJwt.sdJwtVerify(compact, issuerKey, verifyOptions)
  const flattenedBroad = await sdJwt.flattenedSdJwtVerify(flattened, issuerKey, verifyOptions)
  const generalBroad = await sdJwt.generalSdJwtVerify(general, issuerKey, verifyOptions)
  const _optional: sdJwt.SDJWTKeyBindingVerifyResult | undefined = broad.keyBinding
  const _flattenedOptional: sdJwt.SDJWTKeyBindingVerifyResult | undefined =
    flattenedBroad.keyBinding
  const _generalOptional: sdJwt.SDJWTKeyBindingVerifyResult | undefined = generalBroad.keyBinding
}

/* Wrappers that accept either a static key or a resolver get an optional resolved key. Verify
 * wrappers retain each Key Binding policy's result discrimination. */
async function forwardsIssuerKey(key: sdJwt.SDJWTIssuerKey | sdJwt.SDJWTIssuerGetKey) {
  const compactCredential = await sdJwt.sdJwtReceive(compact, key)
  const flattenedCredential = await sdJwt.flattenedSdJwtReceive(flattened, key)
  const generalCredential = await sdJwt.generalSdJwtReceive(general, key)
  const _receiveCompact: Equals<typeof compactCredential.key, CryptoKey | undefined> = true
  const _receiveFlattened: Equals<typeof flattenedCredential.key, CryptoKey | undefined> = true
  const _receiveGeneral: Equals<typeof generalCredential.key, CryptoKey | undefined> = true

  const compactForbidden = await sdJwt.sdJwtVerify(compact, key, { keyBinding: false })
  const flattenedForbidden = await sdJwt.flattenedSdJwtVerify(flattened, key, {
    keyBinding: false,
  })
  const generalForbidden = await sdJwt.generalSdJwtVerify(general, key, { keyBinding: false })
  const _verifyCompact: Equals<typeof compactForbidden.key, CryptoKey | undefined> = true
  const _verifyFlattened: Equals<typeof flattenedForbidden.key, CryptoKey | undefined> = true
  const _verifyGeneral: Equals<typeof generalForbidden.key, CryptoKey | undefined> = true
  // @ts-expect-error forwarding does not weaken the forbidden Key Binding result
  compactForbidden.keyBinding

  const compactRequired = await sdJwt.sdJwtVerify(compact, key, {
    keyBinding: keyBindingPolicy,
  })
  const flattenedRequired = await sdJwt.flattenedSdJwtVerify(flattened, key, {
    keyBinding: keyBindingPolicy,
  })
  const generalRequired = await sdJwt.generalSdJwtVerify(general, key, {
    keyBinding: keyBindingPolicy,
  })
  const _required: sdJwt.SDJWTKeyBindingVerifyResult = compactRequired.keyBinding
  const _flattenedRequired: sdJwt.SDJWTKeyBindingVerifyResult = flattenedRequired.keyBinding
  const _generalRequired: sdJwt.SDJWTKeyBindingVerifyResult = generalRequired.keyBinding

  const compactBroad = await sdJwt.sdJwtVerify(compact, key, verifyOptions)
  const flattenedBroad = await sdJwt.flattenedSdJwtVerify(flattened, key, verifyOptions)
  const generalBroad = await sdJwt.generalSdJwtVerify(general, key, verifyOptions)
  const _optional: sdJwt.SDJWTKeyBindingVerifyResult | undefined = compactBroad.keyBinding
  const _flattenedOptional: sdJwt.SDJWTKeyBindingVerifyResult | undefined =
    flattenedBroad.keyBinding
  const _generalOptional: sdJwt.SDJWTKeyBindingVerifyResult | undefined = generalBroad.keyBinding
}

/* Serialization-specific consuming APIs reject the other two syntaxes. */
async function serializationInputsStayDistinct() {
  // @ts-expect-error Compact receive does not accept Flattened JSON Serialization
  await sdJwt.sdJwtReceive(flattened, issuerKey)
  // @ts-expect-error Compact receive does not accept General JSON Serialization
  await sdJwt.sdJwtReceive(general, issuerKey)
  // @ts-expect-error Flattened receive does not accept Compact Serialization
  await sdJwt.flattenedSdJwtReceive(compact, issuerKey)
  // @ts-expect-error General receive does not accept Flattened JSON Serialization
  await sdJwt.generalSdJwtReceive(flattened, issuerKey)

  // @ts-expect-error Compact verify does not accept Flattened JSON Serialization
  await sdJwt.sdJwtVerify(flattened, issuerKey, { keyBinding: false })
  // @ts-expect-error Flattened verify does not accept Compact Serialization
  await sdJwt.flattenedSdJwtVerify(compact, issuerKey, { keyBinding: false })
  // @ts-expect-error General verify does not accept Flattened JSON Serialization
  await sdJwt.generalSdJwtVerify(flattened, issuerKey, { keyBinding: false })
}
