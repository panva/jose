import type { JWK, KeyLike } from '../types';
export declare function exportSPKI(key: KeyLike): Promise<string>;
export declare function exportPKCS8(key: KeyLike): Promise<string>;
export declare function exportJWK(key: KeyLike | Uint8Array): Promise<JWK>;
