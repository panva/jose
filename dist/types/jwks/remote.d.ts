import type { JWSHeaderParameters, FlattenedJWSInput, GetKeyFunction } from '../types';
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
    /** Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10 minutes). */
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
interface URL {
    href: string;
}
/**
 * Returns a function that resolves to a key object downloaded from a remote endpoint returning a
 * JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC jwks_uri. Only a single public key
 * must match the selection process. The JSON Web Key Set is fetched when no key matches the
 * selection process but only as frequently as the `cooldownDuration` option allows, to prevent abuse.
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
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 */
export declare function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
export {};
