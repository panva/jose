import { JOSEError, JWKSNoMatchingKey, JWKSTimeout } from '../util/errors.js';
import { createLocalJWKSet } from './local.js';
import { isJwkSet } from '../lib/type_checks.js';
function isCloudflareWorkers() {
    return (typeof WebSocketPair !== 'undefined' ||
        (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') ||
        (typeof EdgeRuntime !== 'undefined' && EdgeRuntime === 'vercel'));
}
let USER_AGENT;
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
    const NAME = 'jose';
    const VERSION = 'v6.2.10';
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
function isFreshFor(timestamp, duration) {
    return Number.isFinite(timestamp) && Date.now() < timestamp + duration;
}
function validateDuration(value, fallback, option) {
    if (Number.isNaN(value)) {
        throw new TypeError(`"${option}" option must not be NaN`);
    }
    return typeof value === 'number' ? value : fallback;
}
export function createRemoteJWKSet(url, options) {
    if (!(url instanceof URL)) {
        throw new TypeError('url must be an instance of URL');
    }
    const href = new URL(url.href).href;
    const opts = options ?? {};
    const timeoutOption = opts.timeoutDuration;
    if (typeof timeoutOption === 'number' &&
        (!Number.isInteger(timeoutOption) || timeoutOption < 0)) {
        throw new TypeError('"timeoutDuration" option must be a non-negative integer');
    }
    const timeoutDuration = typeof timeoutOption === 'number' ? timeoutOption : 5000;
    const cooldownDuration = validateDuration(opts.cooldownDuration, 30000, 'cooldownDuration');
    const cacheMaxAge = validateDuration(opts.cacheMaxAge, 600000, 'cacheMaxAge');
    const headers = new Headers(opts.headers);
    if (USER_AGENT && !headers.has('User-Agent')) {
        headers.set('User-Agent', USER_AGENT);
    }
    if (!headers.has('accept')) {
        headers.set('accept', 'application/json, application/jwk-set+json');
    }
    const fetchImpl = opts[customFetch];
    const cache = opts[jwksCache];
    let jwksTimestamp;
    let pendingFetch;
    let reloadSequence = 0;
    let appliedSequence = 0;
    let local;
    if (cache && typeof cache === 'object') {
        const { uat, jwks } = cache;
        if (isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks)) {
            jwksTimestamp = uat;
            local = createLocalJWKSet(jwks);
        }
    }
    const reload = async () => {
        if (pendingFetch && isCloudflareWorkers()) {
            pendingFetch = undefined;
        }
        if (!pendingFetch) {
            const sequence = ++reloadSequence;
            const current = (pendingFetch = fetchJwks(href, headers, AbortSignal.timeout(timeoutDuration), fetchImpl)
                .then((json) => {
                const next = createLocalJWKSet(json);
                if (sequence <= appliedSequence) {
                    return;
                }
                local = next;
                const updatedAt = Date.now();
                if (cache) {
                    cache.uat = updatedAt;
                    cache.jwks = json;
                }
                jwksTimestamp = updatedAt;
                appliedSequence = sequence;
            })
                .finally(() => {
                if (pendingFetch === current) {
                    pendingFetch = undefined;
                }
            }));
        }
        await pendingFetch;
    };
    const remoteJWKSet = async (protectedHeader, token) => {
        if (!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) {
            await reload();
        }
        try {
            return await local(protectedHeader, token);
        }
        catch (err) {
            if (err instanceof JWKSNoMatchingKey && !isFreshFor(jwksTimestamp, cooldownDuration)) {
                await reload();
                return local(protectedHeader, token);
            }
            throw err;
        }
    };
    return Object.defineProperties(remoteJWKSet, {
        coolingDown: {
            get: () => isFreshFor(jwksTimestamp, cooldownDuration),
            enumerable: true,
        },
        fresh: {
            get: () => isFreshFor(jwksTimestamp, cacheMaxAge),
            enumerable: true,
        },
        reload: {
            value: reload,
            enumerable: true,
        },
        reloading: {
            get: () => !!pendingFetch,
            enumerable: true,
        },
        jwks: {
            value: () => local?.jwks(),
            enumerable: true,
        },
    });
}
