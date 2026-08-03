import type * as types from '../types.d.ts';
/**
 * EmbeddedJWK is an implementation of a {@link types.GetKeyFunction GetKeyFunction} intended to be
 * used with the JWS/JWT verify operations whenever you need to opt-in to verify signatures with a
 * public key embedded in the token's "jwk" (JSON Web Key) Header Parameter. It is recommended to
 * combine this with the verify function's `algorithms` option to define accepted JWS "alg"
 * (Algorithm) Header Parameter values.
 *
 * @param protectedHeader JWS Protected Header.
 * @param token The consumed JWS token.
 * @returns The public key from the JWS "jwk" (JSON Web Key) Header Parameter.
 */
export declare function EmbeddedJWK(protectedHeader?: types.JWSHeaderParameters, token?: types.FlattenedJWSInput): Promise<types.CryptoKey>;
