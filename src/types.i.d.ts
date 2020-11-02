/* eslint-disable @typescript-eslint/naming-convention */

interface NodeCrypto extends Crypto {
  readonly CryptoKey: typeof CryptoKey
}

declare module 'crypto' {
  const webcrypto: NodeCrypto
}

export type Awaited<T> = T extends PromiseLike<infer PT> ? PT : never
export type AsyncOrSync<T> = PromiseLike<T> | T

export interface JWEKeyManagementHeaderResults {
  apu?: string
  apv?: string
  epk?: EpkJwk
  iv?: string
  p2c?: number
  p2s?: string
  tag?: string
}

export interface EpkJwk {
  crv: string
  d?: string
  kty: string
  x: string
  y?: string
  [propName: string]: any
}
