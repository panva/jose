import type { KeyLike } from '../types';
export interface GenerateSecretOptions {
    extractable?: boolean;
}
export declare function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<KeyLike | Uint8Array>;
