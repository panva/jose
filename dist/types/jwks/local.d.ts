import type * as t from '../types.d.ts';
/** A key resolver created by {@link createLocalJWKSet}. */
export interface LocalJWKSet {
    (protectedHeader?: t.JWSHeaderParameters, token?: t.FlattenedJWSInput): Promise<t.CryptoKey>;
    /** Returns a structured clone of the original JSON Web Key Set. */
    jwks: () => t.JSONWebKeySet;
}
/**
 * Creates a resolver for a locally available JSON Web Key Set. Selection uses the header's "alg"
 * (Algorithm) and "kid" (Key ID), and respects the JWK's "use" (Public Key Use) and "key_ops" (Key
 * Operations). Exactly one key must match.
 *
 * > Note: Only public signature verification keys are supported, not public encryption keys.
 *
 * @param jwks JSON Web Key Set formatted object.
 */
export declare function createLocalJWKSet(jwks: t.JSONWebKeySet): LocalJWKSet;
