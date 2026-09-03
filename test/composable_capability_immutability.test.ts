import test, { type ExecutionContext } from 'ava'

import { ES256, HS256 } from '../src/algorithms/jws.js'
import { dir } from '../src/algorithms/jwe.js'
import { A256GCM } from '../src/algorithms/jwe/enc.js'
import { DEF } from '../src/algorithms/jwe/zip.js'
import { ES256 as keyES256 } from '../src/algorithms/key.js'
import { composeSignJWT } from '../src/composable/jwt/sign.js'
import { composeEncryptJWT } from '../src/composable/jwt/encrypt.js'
import { composeKeyImport } from '../src/composable/key/import.js'

interface RuntimeKeyDescriptor {
  readonly kty: readonly string[]
  readonly subtle: Readonly<Record<string, unknown>>
  readonly signing?: Readonly<Record<string, unknown>>
  readonly usages: readonly [readonly string[], readonly string[]]
  readonly ops?: readonly (string | undefined)[]
}

interface RuntimeCapability extends Record<PropertyKey, unknown> {
  readonly category: string
  readonly algorithm: string
  readonly key?: RuntimeKeyDescriptor
}

function assertFrozenCapability(t: ExecutionContext, capability: RuntimeCapability): void {
  t.true(Object.isFrozen(capability))
  if (!capability.key) return
  t.true(Object.isFrozen(capability.key))
  t.true(Object.isFrozen(capability.key.kty))
  t.true(Object.isFrozen(capability.key.subtle))
  if (capability.key.signing) t.true(Object.isFrozen(capability.key.signing))
  t.true(Object.isFrozen(capability.key.usages))
  t.true(Object.isFrozen(capability.key.usages[0]))
  t.true(Object.isFrozen(capability.key.usages[1]))
  if (capability.key.ops) t.true(Object.isFrozen(capability.key.ops))
}

test('built-in factories return stable branded immutable capabilities', (t) => {
  const marker = Symbol.for('panva.jose.algorithmCapability.v1')
  for (const factory of [ES256, dir, A256GCM, DEF, keyES256]) {
    const capability = factory() as unknown as RuntimeCapability
    t.is(capability, factory() as unknown as RuntimeCapability)
    assertFrozenCapability(t, capability)
    const descriptor = Object.getOwnPropertyDescriptor(capability, marker)
    t.truthy(descriptor)
    t.false(descriptor!.enumerable)
    t.is(typeof descriptor!.value, 'number')
  }
})

test('branded capabilities remain immutable when returned by another factory', (t) => {
  const operation = ES256() as unknown as RuntimeCapability
  const key = keyES256() as unknown as RuntimeCapability
  const SignJWT = (
    composeSignJWT as unknown as (
      factory: () => RuntimeCapability,
    ) => ReturnType<typeof composeSignJWT>
  )(() => operation)
  const keyImport = (
    composeKeyImport as unknown as (
      factory: () => RuntimeCapability,
    ) => ReturnType<typeof composeKeyImport>
  )(() => key)

  t.truthy(new SignJWT().setProtectedHeader({ alg: 'ES256' }))
  t.true(Object.isFrozen(keyImport))
  t.false(Reflect.set(operation, 'algorithm', 'HS256'))
  t.false(Reflect.set(operation, 'key', (HS256() as unknown as RuntimeCapability).key))
  t.false(Reflect.set(key, 'algorithm', 'HS256'))
})

test('unbranded copies cannot cross the capability boundary', (t) => {
  const sign = composeSignJWT as unknown as (...factories: unknown[]) => unknown
  const encrypt = composeEncryptJWT as unknown as (...factories: unknown[]) => unknown
  const keyImport = composeKeyImport as unknown as (...factories: unknown[]) => unknown

  t.throws(() => sign(() => Object.freeze({ ...ES256() })), { instanceOf: TypeError })
  t.throws(() => encrypt(() => Object.freeze({ ...dir() }), A256GCM), {
    instanceOf: TypeError,
  })
  t.throws(() => keyImport(() => Object.freeze({ ...keyES256() })), {
    instanceOf: TypeError,
  })
})
