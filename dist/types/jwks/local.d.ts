import type * as t from '../types.d.ts';
/** A key resolver created by {@link createLocalJWKSet}. */
export interface LocalJWKSet {
    (protectedHeader?: t.JWSHeaderParameters, token?: t.FlattenedJWSInput): Promise<t.CryptoKey>;
    /** Returns a structured clone of the JSON Web Key Set this resolver was created with. */
    jwks: () => t.JSONWebKeySet;
}
/**
 * Creates a resolver for a locally available JSON Web Key Set.
 *
 * > Note: The function's purpose is to resolve public keys used for verifying signatures and will not work
 * > for public encryption keys.
 *
 * @param jwks JSON Web Key Set formatted object.
 */
export declare function createLocalJWKSet(jwks: t.JSONWebKeySet): LocalJWKSet;
