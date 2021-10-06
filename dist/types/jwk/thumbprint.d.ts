import type { JWK } from '../types';
declare function calculateThumbprint(jwk: JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
export { calculateThumbprint };
export default calculateThumbprint;
export type { JWK };
