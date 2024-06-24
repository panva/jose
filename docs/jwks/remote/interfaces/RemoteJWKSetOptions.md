# Interface: RemoteJWKSetOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Options for the remote JSON Web Key Set.

## Properties

### \[jwksCache\]?

• `optional` **\[jwksCache\]**: [`JWKSCacheInput`](../type-aliases/JWKSCacheInput.md)

See [jwksCache](../variables/jwksCache.md).

***

### agent?

• `optional` **agent**: `any`

An instance of [http.Agent](https://nodejs.org/api/http.html#class-httpagent) or
[https.Agent](https://nodejs.org/api/https.html#class-httpsagent) to pass to the
[http.get](https://nodejs.org/api/http.html#httpgetoptions-callback) or
[https.get](https://nodejs.org/api/https.html#httpsgetoptions-callback) method's options.
Use when behind an http(s) proxy. This is a Node.js runtime specific option, it is ignored when
used outside of Node.js runtime.

***

### cacheMaxAge?

• `optional` **cacheMaxAge**: `number`

Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
minutes).

***

### cooldownDuration?

• `optional` **cooldownDuration**: `number`

Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
successful fetch. Default is 30000 (30 seconds).

***

### headers?

• `optional` **headers**: [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string`\>

Headers to be sent with the HTTP request. Default is that `User-Agent: jose/v${version}` header
is added unless the runtime is a browser in which adding an explicit headers fetch
configuration would cause an unnecessary CORS preflight request.

***

### timeoutDuration?

• `optional` **timeoutDuration**: `number`

Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
the verification will fail. Default is 5000 (5 seconds).
