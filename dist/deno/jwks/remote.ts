import fetchJwks from '../runtime/fetch_jwks.ts'

import type { KeyLike, JWSHeaderParameters, FlattenedJWSInput, JSONWebKeySet } from '../types.d.ts'
import { JWKSNoMatchingKey } from '../util/errors.ts'

import { createLocalJWKSet } from './local.ts'

function isCloudflareWorkers() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' ||
    // @ts-ignore
    (typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers') ||
    // @ts-ignore
    (typeof EdgeRuntime !== 'undefined' && EdgeRuntime === 'vercel')
  )
}

// An explicit user-agent in browser environment is a trigger for CORS preflight requests which
// are not needed for our request, so we're omitting setting a default user-agent in browser
// environments.
let USER_AGENT: string
// @ts-ignore
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
  const NAME = 'jose'
  const VERSION = 'v5.3.0'
  USER_AGENT = `${NAME}/${VERSION}`
}

/** Options for the remote JSON Web Key Set. */
export interface RemoteJWKSetOptions {
  /**
   * Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
   * the verification will fail. Default is 5000 (5 seconds).
   */
  timeoutDuration?: number

  /**
   * Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
   * successful fetch. Default is 30000 (30 seconds).
   */
  cooldownDuration?: number

  /**
   * Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
   * minutes).
   */
  cacheMaxAge?: number | typeof Infinity

  /**
   * An instance of {@link https://nodejs.org/api/http.html#class-httpagent http.Agent} or
   * {@link https://nodejs.org/api/https.html#class-httpsagent https.Agent} to pass to the
   * {@link https://nodejs.org/api/http.html#httpgetoptions-callback http.get} or
   * {@link https://nodejs.org/api/https.html#httpsgetoptions-callback https.get} method's options.
   * Use when behind an http(s) proxy. This is a Node.js runtime specific option, it is ignored when
   * used outside of Node.js runtime.
   */
  agent?: any

  /**
   * Headers to be sent with the HTTP request. Default is that `User-Agent: jose/v${version}` header
   * is added unless the runtime is a browser in which adding an explicit headers fetch
   * configuration would cause an unnecessary CORS preflight request.
   */
  headers?: Record<string, string>
}

class RemoteJWKSet<KeyLikeType extends KeyLike = KeyLike> {
  private _url: URL

  private _timeoutDuration: number

  private _cooldownDuration: number

  private _cacheMaxAge: number

  private _jwksTimestamp?: number

  private _pendingFetch?: Promise<unknown>

  private _options: Pick<RemoteJWKSetOptions, 'agent' | 'headers'>

  private _local!: ReturnType<typeof createLocalJWKSet<KeyLikeType>>

  constructor(url: unknown, options?: RemoteJWKSetOptions) {
    if (!(url instanceof URL)) {
      throw new TypeError('url must be an instance of URL')
    }
    this._url = new URL(url.href)
    this._options = { agent: options?.agent, headers: options?.headers }
    this._timeoutDuration =
      typeof options?.timeoutDuration === 'number' ? options?.timeoutDuration : 5000
    this._cooldownDuration =
      typeof options?.cooldownDuration === 'number' ? options?.cooldownDuration : 30000
    this._cacheMaxAge = typeof options?.cacheMaxAge === 'number' ? options?.cacheMaxAge : 600000
  }

  coolingDown() {
    return typeof this._jwksTimestamp === 'number'
      ? Date.now() < this._jwksTimestamp + this._cooldownDuration
      : false
  }

  fresh() {
    return typeof this._jwksTimestamp === 'number'
      ? Date.now() < this._jwksTimestamp + this._cacheMaxAge
      : false
  }

  async getKey(
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> {
    if (!this._local || !this.fresh()) {
      await this.reload()
    }

    try {
      return await this._local(protectedHeader, token)
    } catch (err) {
      if (err instanceof JWKSNoMatchingKey) {
        if (this.coolingDown() === false) {
          await this.reload()
          return this._local(protectedHeader, token)
        }
      }
      throw err
    }
  }

  async reload() {
    // Do not assume a fetch created in another request reliably resolves
    // see https://github.com/panva/jose/issues/355 and https://github.com/panva/jose/issues/509
    if (this._pendingFetch && isCloudflareWorkers()) {
      this._pendingFetch = undefined
    }

    const headers = new Headers(this._options.headers)
    if (USER_AGENT && !headers.has('User-Agent')) {
      headers.set('User-Agent', USER_AGENT)
      this._options.headers = Object.fromEntries(headers.entries())
    }

    this._pendingFetch ||= fetchJwks(this._url, this._timeoutDuration, this._options)
      .then((json) => {
        this._local = createLocalJWKSet(<JSONWebKeySet>(<unknown>json))
        this._jwksTimestamp = Date.now()
        this._pendingFetch = undefined
      })
      .catch((err: Error) => {
        this._pendingFetch = undefined
        throw err
      })

    await this._pendingFetch
  }
}

/**
 * Returns a function that resolves a JWS JOSE Header to a public key object downloaded from a
 * remote endpoint returning a JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC
 * jwks_uri. The JSON Web Key Set is fetched when no key matches the selection process but only as
 * frequently as the `cooldownDuration` option allows to prevent abuse.
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
 * Note: The function's purpose is to resolve public keys used for verifying signatures and will not
 * work for public encryption keys.
 *
 * @param url URL to fetch the JSON Web Key Set from.
 * @param options Options for the remote JSON Web Key Set.
 */
export function createRemoteJWKSet<KeyLikeType extends KeyLike = KeyLike>(
  url: URL,
  options?: RemoteJWKSetOptions,
): {
  (protectedHeader?: JWSHeaderParameters, token?: FlattenedJWSInput): Promise<KeyLikeType>
  /** @ignore */
  coolingDown: boolean
  /** @ignore */
  fresh: boolean
  /** @ignore */
  reloading: boolean
  /** @ignore */
  reload: () => Promise<void>
  /** @ignore */
  jwks: () => JSONWebKeySet | undefined
} {
  const set = new RemoteJWKSet<KeyLikeType>(url, options)

  const remoteJWKSet = async (
    protectedHeader?: JWSHeaderParameters,
    token?: FlattenedJWSInput,
  ): Promise<KeyLikeType> => set.getKey(protectedHeader, token)

  Object.defineProperties(remoteJWKSet, {
    coolingDown: {
      get: () => set.coolingDown(),
      enumerable: true,
      configurable: false,
    },
    fresh: {
      get: () => set.fresh(),
      enumerable: true,
      configurable: false,
    },
    reload: {
      value: () => set.reload(),
      enumerable: true,
      configurable: false,
      writable: false,
    },
    reloading: {
      // @ts-expect-error
      get: () => !!set._pendingFetch,
      enumerable: true,
      configurable: false,
    },
    jwks: {
      // @ts-expect-error
      value: () => set._local?.jwks(),
      enumerable: true,
      configurable: false,
      writable: false,
    },
  })

  // @ts-expect-error
  return remoteJWKSet
}
