import type { KeyLike, JWSHeaderParameters, FlattenedJWSInput } from '../types';
/** Options for the remote JSON Web Key Set. */
export interface RemoteJWKSetOptions {
    /**
     * Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
     * the verification will fail. Default is 5000 (5 seconds).
     */
    timeoutDuration?: number;
    /**
     * Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
     * successful fetch. Default is 30000 (30 seconds).
     */
    cooldownDuration?: number;
    /**
     * Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
     * minutes).
     */
    cacheMaxAge?: number | typeof Infinity;
    /**
     * An instance of [http.Agent](https://nodejs.org/api/http.html#class-httpagent) or
     * [https.Agent](https://nodejs.org/api/https.html#class-httpsagent) to pass to the
     * [http.get](https://nodejs.org/api/http.html#httpgetoptions-callback) or
     * [https.get](https://nodejs.org/api/https.html#httpsgetoptions-callback) method's options. Use
     * when behind an http(s) proxy. This is a Node.js runtime specific option, it is ignored when
     * used outside of Node.js runtime.
     */
    agent?: any;
    /** Optional headers to be sent with the HTTP request. */
    headers?: Record<string, string>;
}
/**
 * Returns a function that resolves to a key object downloaded from a remote endpoint returning a
 * JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC jwks_uri. The JSON Web Key Set is
 * fetched when no key matches the selection process but only as frequently as the
 * `cooldownDuration` option allows to prevent abuse.
 *
 * It uses the "alg" (JWS Algorithm) Header Parameter to determine the right JWK "kty" (Key Type),
 * then proceeds to match the JWK "kid" (Key ID) with one found in the JWS Header Parameters (if
 * there is one) while also respecting the JWK "use" (Public Key Use) and JWK "key_ops" (Key
 * Operations) Parameters (if they are present on the JWK).
 *
 * Only a single public key must match the selection process. As shown in the example below when
 * multiple keys get matched it is possible to opt-in to iterate over the matched keys and attempt
 * verification in an iterative manner.
 *
 * @example Usage
 *
 * ```js
 * const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
 *
 * const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @example Opting-in to multiple JWKS matches using `createRemoteJWKSet`
 *
 * ```js
 * const options = {
 *   issuer: 'urn:example:issuer',
 *   audience: 'urn:example:audience',
 * }
 * const { payload, protectedHeader } = await jose
 *   .jwtVerify(jwt, JWKS, options)
 *   .catch(async (error) => {
 *     if (error?.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
 *       for await (const publicKey of error) {
 *         try {
 *           return await jose.jwtVerify(jwt, publicKey, options)
 *         } catch (innerError) {
 *           if (innerError?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
 *             continue
 *           }
 *           throw innerError
 *         }
 *       }
 *       throw new jose.errors.JWSSignatureVerificationFailed()
 *     }
 *
 *     throw error
 *   })
 * console.log(protectedHeader)
 * console.log(payload)
 * ```
 *
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 */
export declare function createRemoteJWKSet<T extends KeyLike = KeyLike>(url: URL, options?: RemoteJWKSetOptions): (protectedHeader?: JWSHeaderParameters, token?: FlattenedJWSInput) => Promise<T>;
