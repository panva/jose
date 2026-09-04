import type * as t from '../types.d.ts';
/** Maps a JWK key type to the value returned by {@link importJWK}. */
export type ImportedJWK<JWKType extends t.JWK> = JWKType extends {
    kty: 'oct';
} ? Uint8Array : JWKType extends {
    kty: 'AKP' | 'EC' | 'OKP' | 'RSA';
} ? t.CryptoKey : t.CryptoKey | Uint8Array;
/** Key import options. */
export interface KeyImportOptions {
    /**
     * The value to use as {@link !SubtleCrypto.importKey} `extractable` argument. Default is false for
     * private keys, true otherwise.
     */
    extractable?: boolean;
}
/**
 * Imports a PEM-encoded SPKI string as a {@link !CryptoKey}.
 *
 * > Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * > {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * > (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * @param spki PEM-encoded SPKI string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importSPKI(spki: string, alg: string, options?: KeyImportOptions): Promise<t.CryptoKey>;
/**
 * Imports the SPKI from an X.509 string certificate as a {@link !CryptoKey}.
 *
 * > Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * > {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * > (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * @param x509 X.509 certificate string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importX509(x509: string, alg: string, options?: KeyImportOptions): Promise<t.CryptoKey>;
/**
 * Imports a PEM-encoded PKCS#8 string as a {@link !CryptoKey}.
 *
 * > Note: The OID id-RSASSA-PSS (1.2.840.113549.1.1.10) is not supported in
 * > {@link https://w3c.github.io/webcrypto/ Web Cryptography API}, use the OID rsaEncryption
 * > (1.2.840.113549.1.1.1) instead for all RSA algorithms.
 *
 * @param pkcs8 PEM-encoded PKCS#8 string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importPKCS8(pkcs8: string, alg: string, options?: KeyImportOptions): Promise<t.CryptoKey>;
/**
 * Imports a JWK as a {@link !CryptoKey} or {@link !Uint8Array}.
 *
 * > Note: The JSON Web Key parameters "key_ops" and "ext" are also used in the {@link !CryptoKey} import
 * > process.
 *
 * > Note: Symmetric JSON Web Keys (i.e. `kty: "oct"`) yield back an {@link !Uint8Array} instead of a
 * > {@link !CryptoKey}.
 *
 * @param jwk JSON Web Key.
 * @param alg JSON Web Algorithm identifier to be used with the imported key. Default is the "alg"
 *   property on the JWK. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importJWK<JWKType extends t.JWK>(jwk: JWKType, alg?: string, options?: KeyImportOptions): Promise<ImportedJWK<JWKType>>;
