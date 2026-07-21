import test from 'ava'

import * as jose from '../../src/index.js'
import * as sdJwtSubpath from '../../src/sd-jwt/index.js'
import {
  FlattenedSign,
  GeneralSign,
  type CryptoKey,
  type FlattenedJWS,
  type GeneralJWS,
  type JWTHeaderParameters,
} from '../../src/index.js'
import {
  FlattenedSignSDJWT,
  GeneralSignSDJWT,
  SignSDJWT,
  flattenedSdJwtReceive,
  flattenedSdJwtVerify,
  generalSdJwtReceive,
  generalSdJwtVerify,
  sdJwtReceive,
  sdJwtVerify,
  type FlattenedSDJWT,
  type GeneralSDJWT,
  type ProduceSDJWT,
  type SDJWT,
  type SDJWTCredential,
  type SDJWTHolderKeyResolver,
  type SDJWTHolderSigningKey,
  type SDJWTIssuerGetKey,
  type SDJWTIssuerKey,
  type SDJWTIssuerSigningKey,
  type SDJWTKeyBindingVerificationOptions,
  type SDJWTKeyBindingVerifyResult,
  type SDJWTSignature,
  type SDJWTVerifyOptions,
  type SDJWTVerifyResult,
} from '../../src/sd-jwt/index.js'

function expectType<T>(_value: T): void {}

type SDJWTSubpathTypeExports = [
  sdJwtSubpath.SDJWTSignature,
  sdJwtSubpath.SDJWTCredential,
  sdJwtSubpath.SDJWTDisclosure,
  sdJwtSubpath.SDJWTHolderSigningKey,
  sdJwtSubpath.SDJWTIssuerGetKey,
  sdJwtSubpath.SDJWTIssuerKey,
  sdJwtSubpath.SDJWTIssuerSigningKey,
  sdJwtSubpath.SDJWTKeyBinding,
  sdJwtSubpath.SDJWTReceiveOptions,
  sdJwtSubpath.FlattenedSDJWTVerifyResult,
  sdJwtSubpath.GeneralSDJWTVerifyResult,
  sdJwtSubpath.SDJWTHolderKeyResolver,
  sdJwtSubpath.SDJWTHolderVerificationKey,
  sdJwtSubpath.SDJWTKeyBindingPayload,
  sdJwtSubpath.SDJWTKeyBindingVerificationOptions,
  sdJwtSubpath.SDJWTKeyBindingVerifyResult,
  sdJwtSubpath.SDJWTVerifyOptions,
  sdJwtSubpath.SDJWTVerifyResult,
  sdJwtSubpath.FlattenedSDJWT,
  sdJwtSubpath.GeneralSDJWT,
  sdJwtSubpath.GeneralSDJWTSignature,
  sdJwtSubpath.ProduceSDJWT,
  sdJwtSubpath.SDJWT,
  sdJwtSubpath.SDJWTDecoyCount,
  sdJwtSubpath.SDJWTHashAlgorithm,
  sdJwtSubpath.SDJWTUnprotectedHeaderParameters,
]

test('public SD-JWT types preserve producer and serialization-specific inference', async (t) => {
  const { privateKey: issuerPrivateKey, publicKey: issuerPublicKey } =
    await jose.generateKeyPair('ES256')
  const symmetricKey = crypto.getRandomValues(new Uint8Array(32))
  expectType<SDJWTSubpathTypeExports | undefined>(undefined)
  expectType<SDJWTIssuerKey>(issuerPublicKey)
  expectType<SDJWTIssuerSigningKey>(issuerPrivateKey)
  // @ts-expect-error Issuer signature verification requires a public asymmetric key.
  expectType<SDJWTIssuerKey>(symmetricKey)
  // @ts-expect-error Issuer signing requires a private asymmetric key.
  expectType<SDJWTIssuerSigningKey>(symmetricKey)

  const compactProducer = new SignSDJWT({ disclosed: true })
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuer('https://issuer.example')
    .setSubject('subject')
    .setAudience('audience')
    .setJti('identifier')
    .setNotBefore(1)
    .setExpirationTime('2h')
    .setIssuedAt(2)
    .setDisclosurePaths(['/disclosed'])
    .setHashAlgorithm('sha-256')
    .addDecoys('', 1)
  expectType<ProduceSDJWT>(compactProducer)

  const compact = await compactProducer.sign(issuerPrivateKey)
  expectType<SDJWT>(compact)

  const compactBytes = new TextEncoder().encode(compact)
  const issuerGetKey: SDJWTIssuerGetKey = async () => issuerPublicKey
  const resolvedCredential = await sdJwtReceive<{ disclosed?: boolean }>(compactBytes, issuerGetKey)
  expectType<SDJWTCredential<{ disclosed?: boolean }, string>>(resolvedCredential)
  expectType<CryptoKey | undefined>(resolvedCredential.key)
  expectType<JWTHeaderParameters>(resolvedCredential.protectedHeader)
  expectType<string>(await resolvedCredential.present(['/disclosed']))

  const flattenedPromise: Promise<FlattenedSDJWT> = new FlattenedSignSDJWT({ disclosed: true })
    .setUnprotectedHeader({ alg: 'ES256' })
    .setDisclosurePaths(['/disclosed'])
    .sign(issuerPrivateKey)
  const flattened = await flattenedPromise
  const flattenedCredential = await flattenedSdJwtReceive(flattened, issuerPublicKey)
  const flattenedPresentation: FlattenedSDJWT = await flattenedCredential.present(['/disclosed'])
  expectType<SDJWT>(flattenedPresentation)
  expectType<Pick<typeof flattenedCredential, 'protectedHeader'>>({})

  const generalProducer = new GeneralSignSDJWT({ disclosed: true }).setDisclosurePaths([
    '/disclosed',
  ])
  const signature: SDJWTSignature = generalProducer
    .addSignature(issuerPrivateKey)
    .setUnprotectedHeader({ alg: 'ES256' })
  const general: GeneralSDJWT = await signature.sign()
  const generalCredential = await generalSdJwtReceive(general, issuerPublicKey)
  const generalPresentation: GeneralSDJWT = await generalCredential.present(['/disclosed'])
  expectType<SDJWT>(generalPresentation)
  expectType<Pick<typeof generalCredential, 'protectedHeader'>>({})

  const compactVerified = await sdJwtVerify<{ disclosed?: boolean }>(
    compactBytes,
    issuerPublicKey,
    {
      keyBinding: false,
    },
  )
  expectType<SDJWTVerifyResult<{ disclosed?: boolean }>>(compactVerified)
  expectType<boolean | undefined>(compactVerified.payload.disclosed)
  expectType<JWTHeaderParameters>(compactVerified.protectedHeader)

  const flattenedVerified = await flattenedSdJwtVerify(flattenedPresentation, issuerPublicKey, {
    keyBinding: false,
  })
  expectType<Pick<typeof flattenedVerified, 'protectedHeader'>>({})

  const generalVerified = await generalSdJwtVerify(generalPresentation, issuerPublicKey, {
    keyBinding: false,
  })
  expectType<Pick<typeof generalVerified, 'protectedHeader'>>({})

  const payload = new TextEncoder().encode(JSON.stringify({ disclosed: true }))
  const headerlessFlattened: FlattenedJWS = await new FlattenedSign(payload)
    .setProtectedHeader({ alg: 'ES256' })
    .sign(issuerPrivateKey)
  const headerlessFlattenedCredential = await flattenedSdJwtReceive(
    headerlessFlattened,
    issuerPublicKey,
  )
  const headerlessFlattenedPresentation: FlattenedSDJWT =
    await headerlessFlattenedCredential.present()
  await flattenedSdJwtVerify(headerlessFlattened, issuerPublicKey, { keyBinding: false })
  await flattenedSdJwtVerify(headerlessFlattenedPresentation, issuerPublicKey, {
    keyBinding: false,
  })

  const headerlessGeneral: GeneralJWS = await new GeneralSign(payload)
    .addSignature(issuerPrivateKey)
    .setProtectedHeader({ alg: 'ES256' })
    .sign()
  const headerlessGeneralCredential = await generalSdJwtReceive(headerlessGeneral, issuerPublicKey)
  const headerlessGeneralPresentation: GeneralSDJWT = await headerlessGeneralCredential.present()
  await generalSdJwtVerify(headerlessGeneral, issuerPublicKey, { keyBinding: false })
  await generalSdJwtVerify(headerlessGeneralPresentation, issuerPublicKey, {
    keyBinding: false,
  })

  const holderKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign', 'verify'],
  )
  expectType<SDJWTHolderSigningKey>(holderKeyPair.privateKey)
  // @ts-expect-error Key Binding JWTs require an asymmetric signing key.
  expectType<SDJWTHolderSigningKey>(symmetricKey)

  const boundPresentation = await resolvedCredential
    .addKeyBinding(holderKeyPair.privateKey)
    .setPayload({ transaction_data: ['custom claim'] })
    .setProtectedHeader({ alg: 'ES256' })
    .setAudience('https://verifier.example')
    .setNonce('nonce')
    .setIssuedAt()
    .present(['/disclosed'])
  expectType<string>(boundPresentation)

  const keyBindingVerifyOptions: SDJWTKeyBindingVerificationOptions = {
    audience: 'https://verifier.example',
    nonce: 'nonce',
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  }
  const holderResolver: SDJWTHolderKeyResolver = async () => {
    throw new Error('not called')
  }
  expectType<SDJWTKeyBindingVerificationOptions>(keyBindingVerifyOptions)
  expectType<SDJWTHolderKeyResolver>(holderResolver)

  if (false) {
    const verifiedWithKeyBinding = await sdJwtVerify(boundPresentation, issuerPublicKey, {
      keyBinding: keyBindingVerifyOptions,
    })
    expectType<SDJWTKeyBindingVerifyResult>(verifiedWithKeyBinding.keyBinding)

    const broadOptions = {} as SDJWTVerifyOptions
    const broadlyTypedResult = await sdJwtVerify(compact, issuerPublicKey, broadOptions)
    expectType<SDJWTKeyBindingVerifyResult | undefined>(broadlyTypedResult.keyBinding)

    // @ts-expect-error Compact receive does not accept Flattened JWS JSON Serialization.
    await sdJwtReceive(flattened, issuerPublicKey)
    // @ts-expect-error Compact receive does not accept General JWS JSON Serialization.
    await sdJwtReceive(general, issuerPublicKey)
    // @ts-expect-error Flattened receive does not accept Compact Serialization.
    await flattenedSdJwtReceive(compact, issuerPublicKey)
    // @ts-expect-error Flattened receive does not accept General JWS JSON Serialization.
    await flattenedSdJwtReceive(general, issuerPublicKey)
    // @ts-expect-error General receive does not accept Compact Serialization.
    await generalSdJwtReceive(compact, issuerPublicKey)
    // @ts-expect-error General receive does not accept Flattened JWS JSON Serialization.
    await generalSdJwtReceive(flattened, issuerPublicKey)

    // @ts-expect-error Compact verify does not accept Flattened JWS JSON Serialization.
    await sdJwtVerify(flattenedPresentation, issuerPublicKey, { keyBinding: false })
    // @ts-expect-error Flattened verify does not accept Compact Serialization.
    await flattenedSdJwtVerify(compact, issuerPublicKey, { keyBinding: false })
    // @ts-expect-error General verify does not accept Flattened JWS JSON Serialization.
    await generalSdJwtVerify(flattenedPresentation, issuerPublicKey, { keyBinding: false })

    // @ts-expect-error SDJWTInput is no longer part of the public API.
    expectType<import('../../src/sd-jwt/index.js').SDJWTInput>(compact)
    // @ts-expect-error Key Binding signing is configured through the builder.
    expectType<import('../../src/sd-jwt/index.js').SDJWTKeyBindingSignOptions>({})
    // @ts-expect-error SDJWTCredential is a type-only export.
    sdJwtSubpath.SDJWTCredential

    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.SignSDJWT
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.FlattenedSignSDJWT
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.GeneralSignSDJWT
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.sdJwtReceive
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.flattenedSdJwtReceive
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.generalSdJwtReceive
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.sdJwtVerify
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.flattenedSdJwtVerify
    // @ts-expect-error SD-JWT runtime APIs are only exported from the SD-JWT subpath.
    jose.generalSdJwtVerify

    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTSignature | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTCredential | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTDisclosure | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTHolderSigningKey | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTIssuerGetKey | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTIssuerKey | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTKeyBinding | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTReceiveOptions | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.FlattenedSDJWTVerifyResult | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.GeneralSDJWTVerifyResult | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTHolderKeyResolver | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTHolderVerificationKey | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTKeyBindingPayload | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTKeyBindingVerificationOptions | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTKeyBindingVerifyResult | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTVerifyOptions | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTVerifyResult | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.FlattenedSDJWT | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.GeneralSDJWT | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.GeneralSDJWTSignature | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.ProduceSDJWT | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWT | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTDecoyCount | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTHashAlgorithm | undefined>(undefined)
    // @ts-expect-error SD-JWT types are only exported from the SD-JWT subpath.
    expectType<jose.SDJWTUnprotectedHeaderParameters | undefined>(undefined)
    // @ts-expect-error The serialization is determined by the receive function.
    flattenedCredential.serialization
    // @ts-expect-error The serialization is determined by the verify function.
    compactVerified.serialization
    // @ts-expect-error A forbidden Key Binding JWT means no keyBinding result property.
    compactVerified.keyBinding
    // @ts-expect-error A forbidden Key Binding JWT means no keyBinding result property.
    flattenedVerified.keyBinding
    // @ts-expect-error A forbidden Key Binding JWT means no keyBinding result property.
    generalVerified.keyBinding
  }

  const runtimeExports = [
    'SignSDJWT',
    'FlattenedSignSDJWT',
    'GeneralSignSDJWT',
    'sdJwtReceive',
    'flattenedSdJwtReceive',
    'generalSdJwtReceive',
    'sdJwtVerify',
    'flattenedSdJwtVerify',
    'generalSdJwtVerify',
  ] as const
  for (const name of runtimeExports) {
    t.false(Object.hasOwn(jose, name), `${name} must not be exported from the package root`)
    t.true(Object.hasOwn(sdJwtSubpath, name), `${name} must be exported from the SD-JWT subpath`)
  }

  t.false(Object.hasOwn(jose, 'SDJWTCredential'))
  t.false(Object.hasOwn(sdJwtSubpath, 'SDJWTCredential'))
  t.is(sdJwtSubpath.SignSDJWT, SignSDJWT)
  t.is(sdJwtSubpath.FlattenedSignSDJWT, FlattenedSignSDJWT)
  t.is(sdJwtSubpath.GeneralSignSDJWT, GeneralSignSDJWT)
  t.is(sdJwtSubpath.sdJwtReceive, sdJwtReceive)
  t.is(sdJwtSubpath.flattenedSdJwtReceive, flattenedSdJwtReceive)
  t.is(sdJwtSubpath.generalSdJwtReceive, generalSdJwtReceive)
  t.is(sdJwtSubpath.sdJwtVerify, sdJwtVerify)
  t.is(sdJwtSubpath.flattenedSdJwtVerify, flattenedSdJwtVerify)
  t.is(sdJwtSubpath.generalSdJwtVerify, generalSdJwtVerify)
})
