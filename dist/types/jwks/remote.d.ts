import type * as t from '../types.d.ts';
/**
 * Configures a custom fetch implementation for remote JWKS retrieval.
 *
 * > Note: Fetch-like libraries may have incompatible TypeScript signatures even when they accept the
 * > supplied arguments at runtime.
 */
export declare const customFetch: unique symbol;
/** Custom fetch function. Must return HTTP 200 with a JSON JWKS. See {@link customFetch}. */
export type FetchImplementation = (
/** JWKS URL, passed as the fetch resource. */
url: string, 
/** Options passed to fetch. */
options: {
    headers: Headers;
    method: 'GET';
    /** See {@link !Request.redirect} */
    redirect: 'manual';
    signal: AbortSignal;
}) => Promise<Response>;
/**
 * Symbol used to configure an externally persisted remote JWKS cache.
 *
 * > Warning: Only trusted application code must be allowed to write this cache; its keys are trusted for
 * > signature verification.
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
     * Time in milliseconds after a successful fetch before a missing key can trigger another fetch.
     * Must not be `NaN`. Defaults to 30000 (30 seconds).
     */
    cooldownDuration?: number;
    /**
     * Maximum age of cached keys in milliseconds. Defaults to 600000 (10 minutes); `Infinity`
     * disables expiry. Must not be `NaN`.
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
    /** Last successful fetch, in milliseconds since Unix epoch. */
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
     * Returns a structured clone of the cached JSON Web Key Set, or `undefined` before keys have been
     * fetched or seeded via {@link jwksCache}.
     */
    jwks: () => t.JSONWebKeySet | undefined;
}
/**
 * Creates a resolver for a JSON Web Key Set available at an HTTP(S) URL. Fetches the JSON Web Key
 * Set when the cache is missing or stale. An unmatched key triggers another fetch only when
 * `cooldownDuration` has elapsed since the last successful fetch. Selection uses the header's "alg"
 * and "kid" and respects the JWK's "use" and "key_ops". Exactly one key must match.
 *
 * > Note: Only public signature verification keys are supported, not public encryption keys.
 *
 * @param url URL to fetch the JSON Web Key Set from.
 */
export declare function createRemoteJWKSet(url: URL, options?: RemoteJWKSetOptions): RemoteJWKSet;
