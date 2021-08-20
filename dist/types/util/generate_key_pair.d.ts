import type { KeyLike } from '../types.d';
export interface GenerateKeyPairResult {
    privateKey: KeyLike;
    publicKey: KeyLike;
}
export interface GenerateKeyPairOptions {
    crv?: string;
    modulusLength?: number;
    extractable?: boolean;
}
declare function generateKeyPair(alg: string, options?: GenerateKeyPairOptions): Promise<GenerateKeyPairResult>;
export { generateKeyPair };
export default generateKeyPair;
