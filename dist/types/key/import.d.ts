import type { JWK, KeyLike } from '../types';
export interface PEMImportOptions {
    extractable?: boolean;
}
export declare function importSPKI(spki: string, alg: string, options?: PEMImportOptions): Promise<KeyLike>;
export declare function importX509(x509: string, alg: string, options?: PEMImportOptions): Promise<KeyLike>;
export declare function importPKCS8(pkcs8: string, alg: string, options?: PEMImportOptions): Promise<KeyLike>;
export declare function importJWK(jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike | Uint8Array>;
