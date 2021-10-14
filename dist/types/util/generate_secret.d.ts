import type { KeyLike } from '../types';
export interface GenerateSecretOptions {
    extractable?: boolean;
}
declare function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<KeyLike | Uint8Array>;
export { generateSecret };
export default generateSecret;
