import type * as t from '../types.d.ts';
/**
 * Symbol used to configure a custom fetch implementation for remote JWKS retrieval.
 *
 * > Note: Known caveat: Expect Type-related issues when passing the inputs through to fetch-like modules,
 * > they hardly ever get their typings inline with actual fetch, you should `@ts-expect-error` them.
 */
export declare const customFetch: unique symbol;
/** Function signature accepted by {@link customFetch}. */
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
 * Symbol used to configure an externally persisted remote JWKS cache.
 *
 * > Warning: This option has security implications that must be understood, assessed for applicability, and
 * > accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own
 * > code.
 */
export declare const jwksCache: unique symbol;
/** Remote JWKS resolver options. */
export interface RemoteJWKSetOptions {
    /**
     * Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
     * the verification will fail. Must be a non-negative integer. Default is 5000 (5 seconds).
     */
    timeoutDuration?: number;
    /**
     * Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
     * successful fetch. Must not be `NaN`. Default is 30000 (30 seconds).
     */
    cooldownDuration?: number;
    /**
     * Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
     * minutes). Must not be `NaN`.
     */
    cacheMaxAge?: number | typeof Infinity;
    /** Headers to be sent with the HTTP request. */
    headers?: Record<string, string>;
    /** See {@link jwksCache}. */
    [jwksCache]?: JWKSCacheInput;
    /** See {@link customFetch}. */
    [customFetch]?: FetchImplementation;
}
/** Shape of an externally persisted remote JWKS cache. */
export interface ExportedJWKSCache {
    /** Current cached JSON Web Key Set */
    jwks: t.JSONWebKeySet;
    /** Last updated at timestamp (milliseconds since epoch) */
    uat: number;
}
/** Values accepted by the {@link jwksCache} option. */
export type JWKSCacheInput = ExportedJWKSCache | Record<string, never>;
/** A key resolver created by {@link createRemoteJWKSet}. */
export interface RemoteJWKSet {
    (protectedHeader?: t.JWSHeaderParameters, token?: t.FlattenedJWSInput): Promise<t.CryptoKey>;
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
    jwks: () => t.JSONWebKeySet | undefined;
}
/**
 * Creates a resolver for a JSON Web Key Set available at an HTTP(S) URL.
 *
 * > Note: The function's purpose is to resolve public keys used for verifying signatures and will not work
 * > for public encryption keys.
 *
 * @param url URL to fetch the JSON Web Key Set from.
 */
export declare function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): RemoteJWKSet;
