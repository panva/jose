import type { KeyLike } from '../types';
export interface GenerateKeyPairResult {
    privateKey: Exclude<KeyLike, Uint8Array>;
    publicKey: Exclude<KeyLike, Uint8Array>;
}
export interface GenerateKeyPairOptions {
    crv?: string;
    modulusLength?: number;
    extractable?: boolean;
}
declare function generateKeyPair(alg: string, options?: GenerateKeyPairOptions): Promise<GenerateKeyPairResult>;
export { generateKeyPair };
export default generateKeyPair;
