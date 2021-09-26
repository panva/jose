import type { JWK, KeyLike } from '../types';
export declare function exportSPKI(key: Exclude<KeyLike, Uint8Array>): Promise<string>;
export declare function exportPKCS8(key: Exclude<KeyLike, Uint8Array>): Promise<string>;
export declare function exportJWK(key: KeyLike): Promise<JWK>;
export type { KeyLike, JWK };
