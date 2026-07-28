// Selects the CryptoKey structural fallback by compiling without DOM or Node ambient types.
import type * as jose from 'jose'

declare global {
  interface AbortSignal {}
  interface Headers {}
  interface Response {}
  interface URL {}
}

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

type KeyUsage =
  'decrypt' | 'deriveBits' | 'deriveKey' | 'encrypt' | 'sign' | 'unwrapKey' | 'verify' | 'wrapKey'

const _algorithm: Equals<jose.CryptoKey['algorithm'], { name: string }> = true
const _extractable: Equals<jose.CryptoKey['extractable'], boolean> = true
const _type: Equals<jose.CryptoKey['type'], 'private' | 'public' | 'secret'> = true
const _usages: Equals<jose.CryptoKey['usages'], KeyUsage[]> = true

// @ts-expect-error the fallback must not degrade to any
const _notAny: jose.CryptoKey = 'definitely not a key'
