import test from 'ava'

import * as keyAlgorithms from '../src/algorithms/key.js'
import * as jwsAlgorithms from '../src/algorithms/jws.js'
import * as jweAlgorithms from '../src/algorithms/jwe.js'
import * as contentEncryptionAlgorithms from '../src/algorithms/jwe/enc.js'
import { composeSignJWT } from '../src/composable/jwt/sign.js'
import { composeEncryptJWT } from '../src/composable/jwt/encrypt.js'
import { composeKeyImport } from '../src/composable/key/import.js'
import { composeGenerateKeyPair } from '../src/composable/key/generate/keypair.js'
import { composeGenerateSecret } from '../src/composable/key/generate/secret.js'
import { composeEmbeddedJWK } from '../src/composable/jwk/embedded.js'
import { composeLocalJWKSet } from '../src/composable/jwks/local.js'
import { composeRemoteJWKSet } from '../src/composable/jwks/remote.js'
import { jwksCache } from '../src/jwks/remote.js'
import { base64url } from '../src/index.js'

type RuntimeCapability = {
  readonly category: string
  readonly algorithm: string
}

type RuntimeFactory = () => RuntimeCapability

const keyPairFactories = new Set([
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512',
  'EdDSA',
  'Ed25519',
  'ML_DSA_44',
  'ML_DSA_65',
  'ML_DSA_87',
  'RSA_OAEP',
  'RSA_OAEP_256',
  'RSA_OAEP_384',
  'RSA_OAEP_512',
  'ECDH_ES',
  'ECDH_ES_A128KW',
  'ECDH_ES_A192KW',
  'ECDH_ES_A256KW',
])

const secretFactories = new Set([
  'HS256',
  'HS384',
  'HS512',
  'A128KW',
  'A192KW',
  'A256KW',
  'A128GCMKW',
  'A192GCMKW',
  'A256GCMKW',
  'A128GCM',
  'A192GCM',
  'A256GCM',
  'A128CBC_HS256',
  'A192CBC_HS384',
  'A256CBC_HS512',
])

const entries = Object.entries(keyAlgorithms) as [string, RuntimeFactory][]
const generatedPairs = new Map<string, Promise<CryptoKeyPair>>()

function unavailable(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotSupportedError'
}

function generatedPair(factory: RuntimeFactory, algorithm: string): Promise<CryptoKeyPair> {
  let pair = generatedPairs.get(algorithm)
  if (pair === undefined) {
    const generate = (
      composeGenerateKeyPair as unknown as (
        factory: RuntimeFactory,
      ) => (alg: string, options?: { extractable?: boolean }) => Promise<CryptoKeyPair>
    )(factory)
    pair = generate(algorithm, { extractable: true })
    generatedPairs.set(algorithm, pair)
  }
  return pair
}

test('key catalog exposes 41 stable, branded, role-specific factories', (t) => {
  t.is(entries.length, 41)
  t.is(keyPairFactories.size, 22)
  t.is(secretFactories.size, 15)
  const marker = Symbol.for('panva.jose.algorithmCapability.v1')

  for (const [exportName, factory] of entries) {
    const capability = factory()
    t.is(capability, factory(), `${exportName} is stable`)
    t.true(Object.isFrozen(capability), `${exportName} is frozen`)
    t.is(capability.category, 'key', exportName)
    t.false(Object.hasOwn(capability, 'generate'), `${exportName} has no generation closure`)
    t.is(
      exportName,
      capability.algorithm.replaceAll('-', '_').replaceAll('+', '_'),
      `${exportName} maps to its wire identifier`,
    )
    const descriptor = Object.getOwnPropertyDescriptor(capability, marker)
    t.truthy(descriptor, `${exportName} is branded`)
    t.false(descriptor!.enumerable, `${exportName} brand is hidden`)
    t.notThrows(() => composeKeyImport(factory as never), exportName)
  }
})

for (const exportName of keyPairFactories) {
  const factory = (keyAlgorithms as Record<string, RuntimeFactory>)[exportName]
  const algorithm = factory().algorithm
  test.serial(`keypair factory ${algorithm} generates a key pair`, async (t) => {
    try {
      const pair = await generatedPair(factory, algorithm)
      t.is(pair.privateKey.type, 'private')
      t.is(pair.publicKey.type, 'public')
    } catch (error) {
      if (unavailable(error)) {
        t.pass(`${algorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

for (const exportName of secretFactories) {
  const factory = (keyAlgorithms as Record<string, RuntimeFactory>)[exportName]
  const algorithm = factory().algorithm
  test.serial(`secret factory ${algorithm} generates a secret`, async (t) => {
    const generate = (
      composeGenerateSecret as unknown as (
        factory: RuntimeFactory,
      ) => (alg: string) => Promise<CryptoKey | Uint8Array>
    )(factory)
    try {
      const secret = await generate(algorithm)
      if (algorithm.includes('CBC-HS')) {
        t.true(secret instanceof Uint8Array)
      } else {
        t.is((secret as CryptoKey).type, 'secret')
      }
    } catch (error) {
      if (unavailable(error)) {
        t.pass(`${algorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

for (const [exportName, factory] of entries) {
  const algorithm = factory().algorithm
  test.serial(`key import factory ${algorithm} imports a JWK`, async (t) => {
    const imports = (
      composeKeyImport as unknown as (factory: RuntimeFactory) => {
        importJWK(jwk: JsonWebKey, alg?: string): Promise<CryptoKey | Uint8Array>
      }
    )(factory)

    if (!keyPairFactories.has(exportName)) {
      const oct = { kty: 'oct', k: base64url.encode(new Uint8Array(64)), alg: algorithm }
      t.deepEqual(await imports.importJWK(oct, algorithm), new Uint8Array(64))
      return
    }

    try {
      const pair = await generatedPair(factory, algorithm)
      const jwk = await crypto.subtle.exportKey('jwk', pair.publicKey)
      const imported = await imports.importJWK({ ...jwk, alg: algorithm }, algorithm)
      t.is((imported as CryptoKey).type, 'public')
    } catch (error) {
      if (unavailable(error)) {
        t.pass(`${algorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

for (const [exportName, operationFactory] of Object.entries(jwsAlgorithms) as [
  string,
  RuntimeFactory,
][]) {
  if (exportName.startsWith('HS')) continue
  const algorithm = operationFactory().algorithm
  test.serial(`asymmetric JWS factory ${algorithm} resolves embedded and set JWKs`, async (t) => {
    try {
      const pair = await generatedPair(
        (keyAlgorithms as Record<string, RuntimeFactory>)[exportName],
        algorithm,
      )
      const exported = await crypto.subtle.exportKey('jwk', pair.publicKey)
      const jwk = { ...exported, alg: algorithm, kid: exportName, use: 'sig' }
      const protectedHeader = { alg: algorithm, kid: exportName, jwk }

      const embedded = (
        composeEmbeddedJWK as unknown as (
          factory: RuntimeFactory,
        ) => (header: typeof protectedHeader) => Promise<CryptoKey>
      )(operationFactory)
      t.is((await embedded(protectedHeader)).type, 'public')

      const createLocal = (
        composeLocalJWKSet as unknown as (
          factory: RuntimeFactory,
        ) => (jwks: {
          keys: JsonWebKey[]
        }) => (header: typeof protectedHeader) => Promise<CryptoKey>
      )(operationFactory)
      t.is((await createLocal({ keys: [jwk] })(protectedHeader)).type, 'public')

      const createRemote = composeRemoteJWKSet as unknown as (
        factory: RuntimeFactory,
      ) => (
        url: URL,
        options: { [jwksCache]: { jwks: { keys: JsonWebKey[] }; uat: number } },
      ) => (header: typeof protectedHeader) => Promise<CryptoKey>
      const remote = createRemote(operationFactory)(new URL('https://example.com/jwks'), {
        [jwksCache]: { jwks: { keys: [jwk] }, uat: Date.now() },
      })
      t.is((await remote(protectedHeader)).type, 'public')
    } catch (error) {
      if (unavailable(error)) {
        t.pass(`${algorithm} is unavailable in this runtime`)
        return
      }
      throw error
    }
  })
}

test('key and operation factories cannot cross roles', (t) => {
  const keyImport = composeKeyImport as unknown as (...factories: unknown[]) => unknown
  const keyPair = composeGenerateKeyPair as unknown as (...factories: unknown[]) => unknown
  const secret = composeGenerateSecret as unknown as (...factories: unknown[]) => unknown
  const sign = composeSignJWT as unknown as (...factories: unknown[]) => unknown
  const encrypt = composeEncryptJWT as unknown as (...factories: unknown[]) => unknown

  t.throws(() => keyImport(jwsAlgorithms.ES256), { instanceOf: TypeError })
  t.throws(() => keyPair(jweAlgorithms.RSA_OAEP_256), { instanceOf: TypeError })
  t.throws(() => secret(contentEncryptionAlgorithms.A256GCM), { instanceOf: TypeError })
  t.throws(() => sign(keyAlgorithms.ES256), { instanceOf: TypeError })
  t.throws(() => encrypt(keyAlgorithms.dir, contentEncryptionAlgorithms.A256GCM), {
    instanceOf: TypeError,
  })
})

test('key composers reject wrong eligibility, duplicates, malformed factories, and exceptions', (t) => {
  const keyImport = composeKeyImport as unknown as (...factories: unknown[]) => unknown
  const keyPair = composeGenerateKeyPair as unknown as (...factories: unknown[]) => unknown
  const secret = composeGenerateSecret as unknown as (...factories: unknown[]) => unknown

  t.throws(() => keyImport(), { instanceOf: TypeError })
  t.throws(() => keyImport(keyAlgorithms.ES256, keyAlgorithms.ES256), {
    instanceOf: TypeError,
    message: /Duplicate "ES256" algorithm capability/u,
  })
  t.throws(() => keyPair(keyAlgorithms.HS256), { instanceOf: TypeError })
  t.throws(() => secret(keyAlgorithms.ES256), { instanceOf: TypeError })
  t.throws(() => keyImport(() => null), { instanceOf: TypeError })
  t.throws(() => keyImport(() => Object.freeze({ category: 'key', algorithm: 'ES256' })), {
    instanceOf: TypeError,
  })

  const malformedBrand = { ...keyAlgorithms.ES256() }
  Object.defineProperty(malformedBrand, Symbol.for('panva.jose.algorithmCapability.v1'), {
    value: 9.5,
  })
  Object.freeze(malformedBrand)
  t.throws(() => keyImport(() => malformedBrand), { instanceOf: TypeError })

  const malformedCategory = { ...keyAlgorithms.ES256(), category: 0 }
  Object.defineProperty(malformedCategory, Symbol.for('panva.jose.algorithmCapability.v1'), {
    value: 9,
  })
  Object.freeze(malformedCategory)
  t.throws(() => keyImport(() => malformedCategory), { instanceOf: TypeError })

  const callableCapability = Object.assign(() => undefined, keyAlgorithms.ES256())
  Object.defineProperty(callableCapability, Symbol.for('panva.jose.algorithmCapability.v1'), {
    value: 9,
  })
  Object.freeze(callableCapability)
  t.throws(() => keyImport(() => callableCapability), { instanceOf: TypeError })

  for (const malformed of [
    { category: 'key', algorithm: 'ES256' },
    { ...keyAlgorithms.ES256(), algorithm: 'RS256' },
  ]) {
    Object.defineProperty(malformed, Symbol.for('panva.jose.algorithmCapability.v1'), { value: 9 })
    Object.freeze(malformed)
    t.throws(() => keyImport(() => malformed), { instanceOf: TypeError })
  }

  const cause = new Error('foreign key factory failed')
  const error = t.throws(() =>
    keyImport(() => {
      throw cause
    }),
  )
  t.is(error.cause, cause)
})

test('a selected key factory is invoked once per composition', (t) => {
  let calls = 0
  const capability = keyAlgorithms.ES256()
  const factory = () => {
    calls++
    return capability
  }
  ;(composeKeyImport as unknown as (factory: RuntimeFactory) => unknown)(factory)
  t.is(calls, 1)
})

test('key composition snapshots selection metadata once', (t) => {
  const source = keyAlgorithms.ES256()
  const { category: ignoredCategory, algorithm: ignoredAlgorithm, ...implementation } = source
  void ignoredCategory
  void ignoredAlgorithm

  let categoryReads = 0
  let algorithmReads = 0
  Object.defineProperties(implementation, {
    category: {
      enumerable: true,
      get() {
        if (++categoryReads !== 1) throw new Error('category was read more than once')
        return 'key'
      },
    },
    algorithm: {
      enumerable: true,
      get() {
        if (++algorithmReads !== 1) throw new Error('algorithm was read more than once')
        return 'ES256'
      },
    },
    [Symbol.for('panva.jose.algorithmCapability.v1')]: Object.getOwnPropertyDescriptor(
      source,
      Symbol.for('panva.jose.algorithmCapability.v1'),
    )!,
  })
  const capability = Object.freeze(implementation) as unknown as RuntimeCapability

  ;(composeKeyImport as unknown as (factory: RuntimeFactory) => unknown)(() => capability)
  t.is(categoryReads, 1)
  t.is(algorithmReads, 1)
})
