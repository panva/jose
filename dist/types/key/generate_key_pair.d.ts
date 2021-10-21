import type { KeyLike } from '../types';
export interface GenerateKeyPairResult {
    privateKey: KeyLike;
    publicKey: KeyLike;
}
export interface GenerateKeyPairOptions {
    crv?: string;
    modulusLength?: number;
    extractable?: boolean;
}
export declare function generateKeyPair(alg: string, options?: GenerateKeyPairOptions): Promise<GenerateKeyPairResult>;
