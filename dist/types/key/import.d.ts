import type * as types from '../types.d.ts';
/**
 * Resolves what {@link importJWK} returns for a given JWK type. The "kty" (Key Type) Parameter fully
 * determines the outcome at runtime: `"oct"` yields a {@link !Uint8Array} secret, every other
 * supported key type yields a {@link types.CryptoKey CryptoKey}. When "kty" is not statically known
 * — the usual case for a JWK parsed from JSON, or for a value typed as {@link types.JWK JWK} — this
 * resolves to their union.
 */
export type ImportedJWK<JWKType extends types.JWK> = JWKType extends {
    kty: 'oct';
} ? Uint8Array : JWKType extends {
    kty: 'AKP' | 'EC' | 'OKP' | 'RSA';
} ? types.CryptoKey : types.CryptoKey | Uint8Array;
/** Key Import Function options. */
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
export declare function importSPKI(spki: string, alg: string, options?: KeyImportOptions): Promise<types.CryptoKey>;
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
export declare function importX509(x509: string, alg: string, options?: KeyImportOptions): Promise<types.CryptoKey>;
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
export declare function importPKCS8(pkcs8: string, alg: string, options?: KeyImportOptions): Promise<types.CryptoKey>;
/**
 * Imports a JWK to a {@link !CryptoKey}. Either the JWK "alg" (Algorithm) Parameter, or the optional
 * "alg" argument, must be present for asymmetric JSON Web Key imports.
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
export declare function importJWK<JWKType extends types.JWK>(jwk: JWKType, alg?: string, options?: KeyImportOptions): Promise<ImportedJWK<JWKType>>;
