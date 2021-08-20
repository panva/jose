export type Awaited<T> = T extends PromiseLike<infer PT> ? PT : never
export type AsyncOrSync<T> = PromiseLike<T> | T

export interface JWEKeyManagementHeaderResults {
  apu?: string
  apv?: string
  epk?: { x?: string; y?: string; crv?: string; kty?: string }
  iv?: string
  p2c?: number
  p2s?: string
  tag?: string
  [propName: string]: unknown
}
