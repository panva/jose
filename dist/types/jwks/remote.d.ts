import type * as types from '../types.d.ts';
/**
 * When passed to {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} this allows the resolver
 * to make use of advanced fetch configurations, HTTP Proxies, retry on network errors, etc.
 *
 * > Note: Known caveat: Expect Type-related issues when passing the inputs through to fetch-like modules,
 * > they hardly ever get their typings inline with actual fetch, you should `@ts-expect-error` them.
 */
export declare const customFetch: unique symbol;
/** See {@link customFetch}. */
export type FetchImplementation = (
/** URL the request is being made sent to {@link !fetch} as the `resource` argument */
url: string, 
/** Options otherwise sent to {@link !fetch} as the `options` argument */
options: {
    /** HTTP Headers */
    headers: Headers;
    /** The {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods request method} */
    method: 'GET';
    /** See {@link !Request.redirect} */
    redirect: 'manual';
    signal: AbortSignal;
}) => Promise<Response>;
/**
 * > Warning: This option has security implications that must be understood, assessed for applicability, and
 * > accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own
 * > code.
 *
 * This option is intended for cloud computing runtimes that cannot keep an in memory cache between
 * their code's invocations. The supplied writable object seeds the resolver's cache and is updated
 * with `jwks` and `uat` after a successful fetch; persist it whenever `uat` changes. Using this in
 * runtimes that can keep an in-memory cache between requests is not desirable.
 */
export declare const jwksCache: unique symbol;
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
    /** Headers to be sent with the HTTP request. */
    headers?: Record<string, string>;
    /** See {@link jwksCache}. */
    [jwksCache]?: JWKSCacheInput;
    /** See {@link customFetch}. */
    [customFetch]?: FetchImplementation;
}
/** See {@link jwksCache}. */
export interface ExportedJWKSCache {
    /** Current cached JSON Web Key Set */
    jwks: types.JSONWebKeySet;
    /** Last updated at timestamp (seconds since epoch) */
    uat: number;
}
/** See {@link jwksCache}. */
export type JWKSCacheInput = ExportedJWKSCache | Record<string, never>;
/** The key resolution function returned by {@link createRemoteJWKSet}. */
export interface RemoteJWKSet {
    (protectedHeader?: types.JWSHeaderParameters, token?: types.FlattenedJWSInput): Promise<types.CryptoKey>;
    /** Whether the cooldown window following the last successful fetch is still in effect. */
    readonly coolingDown: boolean;
    /**
     * Whether the currently cached JSON Web Key Set is within its
     * {@link RemoteJWKSetOptions.cacheMaxAge}.
     */
    readonly fresh: boolean;
    /** Whether a JSON Web Key Set fetch is currently in flight. */
    readonly reloading: boolean;
    /**
     * Triggers a JSON Web Key Set fetch, bypassing
     * {@link RemoteJWKSetOptions.cooldownDuration the cooldown}.
     */
    reload: () => Promise<void>;
    /**
     * The currently cached JSON Web Key Set, or `undefined` when none has been fetched or seeded via
     * {@link jwksCache} yet.
     */
    jwks: () => types.JSONWebKeySet | undefined;
}
/**
 * Returns a function that resolves a JWS JOSE Header to a public key object downloaded from a
 * remote endpoint returning a JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC
 * jwks_uri. The JSON Web Key Set is fetched when no key matches the selection process but only as
 * frequently as the `cooldownDuration` option allows to prevent abuse. Selection respects the
 * header's "alg" (Algorithm) and "kid" (Key ID) as well as the JWK's "use" (Public Key Use) and
 * "key_ops" (Key Operations). Exactly one key must match; if multiple keys match, the thrown
 * `JWKSMultipleMatchingKeys` can be iterated.
 *
 * > Note: The function's purpose is to resolve public keys used for verifying signatures and will not work
 * > for public encryption keys.
 *
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 */
export declare function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): RemoteJWKSet;
