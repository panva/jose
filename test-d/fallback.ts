// Selects the CryptoKey structural fallback by compiling without DOM or Node ambient types.
import * as jose from 'jose'

declare global {
  interface AbortSignal {}
  interface Headers {}
  interface Response {}
  interface URL {}

  abstract class CryptoKey {
    readonly type: string
    readonly extractable: boolean
    readonly algorithm: { name: string }
    readonly usages: string[]
  }

  interface CryptoKeyPair {
    privateKey: CryptoKey
    publicKey: CryptoKey
  }

  interface SubtleCrypto {
    generateKey(
      algorithm: string,
      extractable: boolean,
      keyUsages: string[],
    ): Promise<CryptoKey | CryptoKeyPair>
  }

  interface Crypto {
    readonly subtle: SubtleCrypto
  }

  const crypto: Crypto
}

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

const _algorithm: Equals<jose.CryptoKey['algorithm'], { name: string }> = true
const _extractable: Equals<jose.CryptoKey['extractable'], boolean> = true
const _type: Equals<jose.CryptoKey['type'], string> = true
const _usages: Equals<jose.CryptoKey['usages'], string[]> = true

// @ts-expect-error the fallback must not degrade to any
const _notAny: jose.CryptoKey = 'definitely not a key'

declare const token: string
declare const key: CryptoKey

jose.jwtVerify(token, key)
