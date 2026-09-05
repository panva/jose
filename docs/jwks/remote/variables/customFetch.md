# Variable: customFetch

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• `const` **customFetch**: unique `symbol`

Configures a custom fetch implementation for remote JWKS retrieval.

Pass this to [createRemoteJWKSet](../functions/createRemoteJWKSet.md) to use advanced fetch
configurations, HTTP proxies, network-error retries, and similar behavior.

> [!NOTE]\
> Fetch-like libraries may have incompatible TypeScript signatures even when they accept the
> supplied arguments at runtime.

## Examples

Using [sindresorhus/ky](https://github.com/sindresorhus/ky) for retries and its hooks feature for
logging outgoing requests and their responses.

```ts
import ky from 'ky'

// Prerequisites
let url!: URL

let logRequest!: (request: Request) => void
let logResponse!: (request: Request, response: Response) => void
let logRetry!: (request: Request, error: Error, retryCount: number) => void

const JWKS = jose.createRemoteJWKSet(url, {
  [jose.customFetch]: (...args) =>
    ky(args[0], {
      ...args[1],
      hooks: {
        beforeRequest: [
          (request) => {
            logRequest(request)
          },
        ],
        beforeRetry: [
          ({ request, error, retryCount }) => {
            logRetry(request, error, retryCount)
          },
        ],
        afterResponse: [
          (request, _, response) => {
            logResponse(request, response)
          },
        ],
      },
    }),
})
```

Using [nodejs/undici](https://github.com/nodejs/undici) to detect and use HTTP proxies.

```ts
import * as undici from 'undici'

// Prerequisites
let url!: URL

// see https://undici.nodejs.org/api/EnvHttpProxyAgent
let envHttpProxyAgent = new undici.EnvHttpProxyAgent()

// @ts-ignore
const JWKS = jose.createRemoteJWKSet(url, {
  [jose.customFetch]: (...args) => {
    // @ts-ignore
    return undici.fetch(args[0], { ...args[1], dispatcher: envHttpProxyAgent }) // prettier-ignore
  },
})
```

Using [nodejs/undici](https://github.com/nodejs/undici) to automatically retry network errors.

```ts
import * as undici from 'undici'

// Prerequisites
let url!: URL

// see https://undici.nodejs.org/api/RetryAgent
let retryAgent = new undici.RetryAgent(new undici.Agent(), {
  statusCodes: [],
  errorCodes: [
    'ECONNRESET',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ENETDOWN',
    'ENETUNREACH',
    'EHOSTDOWN',
    'UND_ERR_SOCKET',
  ],
})

// @ts-ignore
const JWKS = jose.createRemoteJWKSet(url, {
  [jose.customFetch]: (...args) => {
    // @ts-ignore
    return undici.fetch(args[0], { ...args[1], dispatcher: retryAgent }) // prettier-ignore
  },
})
```

Using [nodejs/undici](https://github.com/nodejs/undici) to mock responses in tests.

```ts
import * as undici from 'undici'

// Prerequisites
let url!: URL

// see https://undici.nodejs.org/api/MockAgent
let mockAgent = new undici.MockAgent()
mockAgent.disableNetConnect()

// @ts-ignore
const JWKS = jose.createRemoteJWKSet(url, {
  [jose.customFetch]: (...args) => {
    // @ts-ignore
    return undici.fetch(args[0], { ...args[1], dispatcher: mockAgent }) // prettier-ignore
  },
})
```
