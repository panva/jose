import type { KeyObject } from 'crypto'
import type { KeyLike } from '../types.d'
export declare function generateSecret(alg: string): Promise<KeyLike>
interface Options {
  crv?: string
}
export declare function generateKeyPair(
  alg: string,
  options?: Options,
): Promise<{
  privateKey: CryptoKey | KeyObject
  publicKey: CryptoKey | KeyObject
}>
export {}
