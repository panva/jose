import type * as t from '../types.d.ts';
/** Algorithms supported by {@link generateKeyPair}, subject to runtime support. */
export type GenerateKeyPairAlgorithm = 'PS256' | 'PS384' | 'PS512' | 'RS256' | 'RS384' | 'RS512' | 'RSA-OAEP' | 'RSA-OAEP-256' | 'RSA-OAEP-384' | 'RSA-OAEP-512' | 'ES256' | 'ES384' | 'ES512' | 'Ed25519' | 'EdDSA' | 'ML-DSA-44' | 'ML-DSA-65' | 'ML-DSA-87' | 'ECDH-ES' | 'ECDH-ES+A128KW' | 'ECDH-ES+A192KW' | 'ECDH-ES+A256KW' | (string & {});
/** Generated asymmetric key pair. */
export interface GenerateKeyPairResult {
    privateKey: t.CryptoKey;
    publicKey: t.CryptoKey;
}
/** Asymmetric key pair generation options. */
export interface GenerateKeyPairOptions {
    /**
     * EC curve or OKP key subtype. Must be supported by the algorithm and runtime. ECDH-ES defaults
     * to P-256.
     */
    crv?: string;
    /** RSA modulus length in bits. Must be an integer of at least 2048; defaults to 2048. */
    modulusLength?: number;
    /**
     * Whether the private key is extractable. Defaults to false; the public key is always
     * extractable.
     */
    extractable?: boolean;
}
/**
 * Generates an asymmetric key pair for a JWA algorithm identifier.
 *
 * > Note: Private keys are not extractable by default. Set {@link GenerateKeyPairOptions.extractable} to
 * > export them; public keys are always extractable.
 *
 * @param alg JWA Algorithm Identifier to be used with the generated key pair. See
 *   {@link https://github.com/panva/jose/issues/210 Algorithm Key Requirements}.
 */
export declare function generateKeyPair(alg: GenerateKeyPairAlgorithm, options?: GenerateKeyPairOptions): Promise<GenerateKeyPairResult>;
