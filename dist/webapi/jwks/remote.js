import { JOSEError, JWKSNoMatchingKey, JWKSTimeout } from '../util/errors.js';
import { createLocalJWKSet } from './local.js';
import { isObject } from '../lib/type_checks.js';
function isCloudflareWorkers() {
    return (typeof WebSocketPair !== 'undefined' ||
        (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') ||
        (typeof EdgeRuntime !== 'undefined' && EdgeRuntime === 'vercel'));
}
let USER_AGENT;
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
    const NAME = 'jose';
    const VERSION = 'v6.2.7';
    USER_AGENT = `${NAME}/${VERSION}`;
}
export const customFetch = Symbol();
async function fetchJwks(url, headers, signal, fetchImpl = fetch) {
    const response = await fetchImpl(url, {
        method: 'GET',
        signal,
        redirect: 'manual',
        headers,
    }).catch((err) => {
        if (err.name === 'TimeoutError') {
            throw new JWKSTimeout();
        }
        throw err;
    });
    if (response.status !== 200) {
        throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response');
    }
    try {
        return await response.json();
    }
    catch {
        throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON');
    }
}
export const jwksCache = Symbol();
function isFreshJwksCache(input, cacheMaxAge) {
    if (typeof input !== 'object' || input === null) {
        return false;
    }
    if (!('uat' in input) || typeof input.uat !== 'number' || Date.now() - input.uat >= cacheMaxAge) {
        return false;
    }
    if (!('jwks' in input) ||
        !isObject(input.jwks) ||
        !Array.isArray(input.jwks.keys) ||
        !Array.prototype.every.call(input.jwks.keys, isObject)) {
        return false;
    }
    return true;
}
class RemoteJWKSetImpl {
    #url;
    #timeoutDuration;
    #cooldownDuration;
    #cacheMaxAge;
    #jwksTimestamp;
    #pendingFetch;
    #headers;
    #customFetch;
    #local;
    #cache;
    constructor(url, options) {
        if (!(url instanceof URL)) {
            throw new TypeError('url must be an instance of URL');
        }
        this.#url = new URL(url.href);
        const opts = options ?? {};
        this.#timeoutDuration = typeof opts.timeoutDuration === 'number' ? opts.timeoutDuration : 5000;
        this.#cooldownDuration =
            typeof opts.cooldownDuration === 'number' ? opts.cooldownDuration : 30000;
        this.#cacheMaxAge = typeof opts.cacheMaxAge === 'number' ? opts.cacheMaxAge : 600000;
        this.#headers = new Headers(opts.headers);
        if (USER_AGENT && !this.#headers.has('User-Agent')) {
            this.#headers.set('User-Agent', USER_AGENT);
        }
        if (!this.#headers.has('accept')) {
            this.#headers.set('accept', 'application/json');
            this.#headers.append('accept', 'application/jwk-set+json');
        }
        this.#customFetch = opts[customFetch];
        const cache = opts[jwksCache];
        if (cache !== undefined) {
            this.#cache = cache;
            if (isFreshJwksCache(cache, this.#cacheMaxAge)) {
                this.#jwksTimestamp = this.#cache.uat;
                this.#local = createLocalJWKSet(this.#cache.jwks);
            }
        }
    }
    pendingFetch() {
        return !!this.#pendingFetch;
    }
    #validFor(duration) {
        return typeof this.#jwksTimestamp === 'number' && Date.now() < this.#jwksTimestamp + duration;
    }
    coolingDown() {
        return this.#validFor(this.#cooldownDuration);
    }
    fresh() {
        return this.#validFor(this.#cacheMaxAge);
    }
    jwks() {
        return this.#local?.jwks();
    }
    async getKey(protectedHeader, token) {
        if (!this.#local || !this.fresh()) {
            await this.reload();
        }
        try {
            return await this.#local(protectedHeader, token);
        }
        catch (err) {
            if (err instanceof JWKSNoMatchingKey) {
                if (this.coolingDown() === false) {
                    await this.reload();
                    return this.#local(protectedHeader, token);
                }
            }
            throw err;
        }
    }
    async reload() {
        if (this.#pendingFetch && isCloudflareWorkers()) {
            this.#pendingFetch = undefined;
        }
        this.#pendingFetch ||= fetchJwks(this.#url.href, this.#headers, AbortSignal.timeout(this.#timeoutDuration), this.#customFetch)
            .then((json) => {
            this.#local = createLocalJWKSet(json);
            if (this.#cache) {
                this.#cache.uat = Date.now();
                this.#cache.jwks = json;
            }
            this.#jwksTimestamp = Date.now();
        })
            .finally(() => {
            this.#pendingFetch = undefined;
        });
        await this.#pendingFetch;
    }
}
export function createRemoteJWKSet(url, options) {
    const set = new RemoteJWKSetImpl(url, options);
    const remoteJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
    Object.defineProperties(remoteJWKSet, {
        coolingDown: {
            get: () => set.coolingDown(),
            enumerable: true,
        },
        fresh: {
            get: () => set.fresh(),
            enumerable: true,
        },
        reload: {
            value: () => set.reload(),
            enumerable: true,
        },
        reloading: {
            get: () => set.pendingFetch(),
            enumerable: true,
        },
        jwks: {
            value: () => set.jwks(),
            enumerable: true,
        },
    });
    return remoteJWKSet;
}
