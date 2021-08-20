import type { KeyLike } from '../types.d';
export interface GenerateSecretOptions {
    extractable?: boolean;
}
declare function generateSecret(alg: string, options?: GenerateSecretOptions): Promise<KeyLike>;
export { generateSecret };
export default generateSecret;
