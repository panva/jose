import { parseJwk as importJwk } from '../jwk/parse';
import type { KeyLike } from '../types';
export interface PEMImportOptions {
    extractable?: boolean;
}
export declare function importSPKI(spki: string, alg: string, options?: PEMImportOptions): Promise<Exclude<KeyLike, Uint8Array>>;
export declare function importX509(x509: string, alg: string, options?: PEMImportOptions): Promise<Exclude<KeyLike, Uint8Array>>;
export declare function importPKCS8(pkcs8: string, alg: string, options?: PEMImportOptions): Promise<Exclude<KeyLike, Uint8Array>>;
export declare const importJWK: typeof importJwk;
export type { KeyLike };
