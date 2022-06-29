import type { KeyLike, JWSHeaderParameters, JSONWebKeySet, FlattenedJWSInput, GetKeyFunction } from '../types';
/**
 * @private
 */
export declare function isJWKSLike(jwks: unknown): jwks is JSONWebKeySet;
/**
 * @private
 */
export declare class LocalJWKSet {
    protected _jwks?: JSONWebKeySet;
    private _cached;
    constructor(jwks: unknown);
    getKey(protectedHeader: JWSHeaderParameters, token: FlattenedJWSInput): Promise<KeyLike>;
}
/**
 * Returns a function that resolves to a key object from a locally
 * stored, or otherwise available, JSON Web Key Set.
 *
 * Only a single public key must match the selection process.
 *
 * @param jwks JSON Web Key Set formatted object.
 *
 * @example Usage
 * ```js
 * const JWKS = jose.createLocalJWKSet({
 *   keys: [
 *     {
 *       kty: 'RSA',
 *       e: 'AQAB',
 *       n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
 *       alg: 'PS256'
 *     },
 *     {
 *       crv: 'P-256',
 *       kty: 'EC',
 *       x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
 *       y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo',
 *       alg: 'ES256'
 *     }
 *   ]
 * })
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience'
 * })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 */
export declare function createLocalJWKSet(jwks: JSONWebKeySet): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
