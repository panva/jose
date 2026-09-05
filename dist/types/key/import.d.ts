import type * as t from '../types.d.ts';
/**
 * Maps a JWK key type to the value returned by {@link importJWK}. An "oct" JWK returns
 * {@link !Uint8Array}; other supported key types return {@link t.CryptoKey CryptoKey}. A JWK
 * whose "kty" is not statically known resolves to their union.
 */
export type ImportedJWK<JWKType extends t.JWK> = JWKType extends {
    kty: 'oct';
} ? Uint8Array : JWKType extends {
    kty: 'AKP' | 'EC' | 'OKP' | 'RSA';
} ? t.CryptoKey : t.CryptoKey | Uint8Array;
/** Key import options. */
export interface KeyImportOptions {
    /**
     * Whether the imported CryptoKey is extractable. Overrides JWK "ext" when set. Without either,
     * defaults to false for private keys, true otherwise.
     */
    extractable?: boolean;
}
/**
 * Imports a PEM-encoded SPKI string as a {@link !CryptoKey}.
 *
 * > Note: For RSA keys, use the rsaEncryption OID (1.2.840.113549.1.1.1). The id-RSASSA-PSS OID
 * > (1.2.840.113549.1.1.10) is not supported by the Web Cryptography API.
 *
 * @param spki PEM-encoded SPKI string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importSPKI(spki: string, alg: string, options?: KeyImportOptions): Promise<t.CryptoKey>;
/**
 * Imports a PEM-encoded X.509 certificate's public key as a {@link !CryptoKey}.
 *
 * > Note: For RSA keys, use the rsaEncryption OID (1.2.840.113549.1.1.1). The id-RSASSA-PSS OID
 * > (1.2.840.113549.1.1.10) is not supported by the Web Cryptography API.
 *
 * @param x509 X.509 certificate string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importX509(x509: string, alg: string, options?: KeyImportOptions): Promise<t.CryptoKey>;
/**
 * Imports a PEM-encoded PKCS#8 string as a {@link !CryptoKey}.
 *
 * > Note: For RSA keys, use the rsaEncryption OID (1.2.840.113549.1.1.1). The id-RSASSA-PSS OID
 * > (1.2.840.113549.1.1.10) is not supported by the Web Cryptography API.
 *
 * @param pkcs8 PEM-encoded PKCS#8 string
 * @param alg JSON Web Algorithm identifier to be used with the imported key. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importPKCS8(pkcs8: string, alg: string, options?: KeyImportOptions): Promise<t.CryptoKey>;
/**
 * Imports a JWK as a {@link !CryptoKey} or {@link !Uint8Array}. Asymmetric imports require either the
 * "alg" argument or JWK "alg" parameter. For AKP keys, the JWK "alg" parameter is required and must
 * match the argument when provided.
 *
 * > Note: CryptoKey imports honor the JWK "key_ops" and "ext" parameters.
 *
 * > Note: Symmetric JWKs (`kty: "oct"`) return {@link !Uint8Array} instead of CryptoKey.
 *
 * @param jwk JSON Web Key.
 * @param alg JSON Web Algorithm identifier to be used with the imported key. Default is the "alg"
 *   property on the JWK. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function importJWK<JWKType extends t.JWK>(jwk: JWKType, alg?: string, options?: KeyImportOptions): Promise<ImportedJWK<JWKType>>;
