import type * as t from '../types.d.ts';
/**
 * Resolves a verification key from an embedded "jwk" (JSON Web Key) Header Parameter. This key
 * resolver opts JWS and JWT verification into trusting a public key supplied by the token. Use the
 * verification function's `algorithms` option to restrict accepted algorithms.
 *
 * @param token The consumed JWS token.
 * @returns The public key from the JWS "jwk" (JSON Web Key) Header Parameter.
 */
export declare function EmbeddedJWK(protectedHeader?: t.JWSHeaderParameters, token?: t.FlattenedJWSInput): Promise<t.CryptoKey>;
