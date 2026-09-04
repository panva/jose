import type * as t from '../types.d.ts';
/**
 * JWA Algorithm Identifiers that {@link generateKeyPair} is able to generate a key pair for, subject
 * to runtime support.
 */
export type GenerateKeyPairAlgorithm = 'PS256' | 'PS384' | 'PS512' | 'RS256' | 'RS384' | 'RS512' | 'RSA-OAEP' | 'RSA-OAEP-256' | 'RSA-OAEP-384' | 'RSA-OAEP-512' | 'ES256' | 'ES384' | 'ES512' | 'Ed25519' | 'EdDSA' | 'ML-DSA-44' | 'ML-DSA-65' | 'ML-DSA-87' | 'ECDH-ES' | 'ECDH-ES+A128KW' | 'ECDH-ES+A192KW' | 'ECDH-ES+A256KW' | (string & {});
/** Generated asymmetric key pair. */
export interface GenerateKeyPairResult {
    /** The generated Private Key. */
    privateKey: t.CryptoKey;
    /** Public Key corresponding to the generated Private Key. */
    publicKey: t.CryptoKey;
}
/** Asymmetric key pair generation options. */
export interface GenerateKeyPairOptions {
    /**
     * The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate. The curve must be
     * both supported on the runtime as well as applicable for the given JWA algorithm identifier.
     */
    crv?: string;
    /**
     * A hint for RSA algorithms to generate an RSA key of a given `modulusLength` (Key size in bits).
     * JOSE requires 2048 bits or larger. Default is 2048.
     */
    modulusLength?: number;
    /** The value to use as {@link !SubtleCrypto.generateKey} `extractable` argument. Default is false. */
    extractable?: boolean;
}
/**
 * Generates an asymmetric key pair for a JWA algorithm identifier.
 *
 * > Note: The `privateKey` is generated with `extractable` set to `false` by default. See
 * > {@link GenerateKeyPairOptions.extractable} to generate an extractable `privateKey`.
 *
 * @param alg JWA Algorithm Identifier to be used with the generated key pair. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function generateKeyPair(alg: GenerateKeyPairAlgorithm, options?: GenerateKeyPairOptions): Promise<GenerateKeyPairResult>;
