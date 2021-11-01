import type { JWK } from '../types';
export declare function calculateJwkThumbprint(jwk: JWK, digestAlgorithm?: 'sha256' | 'sha384' | 'sha512'): Promise<string>;
