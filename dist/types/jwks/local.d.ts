import type * as types from '../types.d.ts';
/** The key resolution function returned by {@link createLocalJWKSet}. */
export interface LocalJWKSet {
    (protectedHeader?: types.JWSHeaderParameters, token?: types.FlattenedJWSInput): Promise<types.CryptoKey>;
    /** Returns a structured clone of the JSON Web Key Set this resolver was created with. */
    jwks: () => types.JSONWebKeySet;
}
/**
 * Returns a function that resolves a JWS JOSE Header to a public key object from a locally stored,
 * or otherwise available, JSON Web Key Set. Selection respects the header's "alg" (Algorithm) and
 * "kid" (Key ID) as well as the JWK's "use" (Public Key Use) and "key_ops" (Key Operations).
 * Exactly one key must match; if multiple keys match, the thrown `JWKSMultipleMatchingKeys` can be
 * iterated.
 *
 * > Note: The function's purpose is to resolve public keys used for verifying signatures and will not work
 * > for public encryption keys.
 *
 * @param jwks JSON Web Key Set formatted object.
 */
export declare function createLocalJWKSet(jwks: types.JSONWebKeySet): LocalJWKSet;
