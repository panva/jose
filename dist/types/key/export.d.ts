import { fromKeyLike } from '../jwk/from_key_like';
import type { KeyLike } from '../types';
export declare function exportSPKI(key: Exclude<KeyLike, Uint8Array>): Promise<string>;
export declare function exportPKCS8(key: Exclude<KeyLike, Uint8Array>): Promise<string>;
export declare const exportJWK: typeof fromKeyLike;
export type { KeyLike };
