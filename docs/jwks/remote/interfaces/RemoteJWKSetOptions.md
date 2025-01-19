# Interface: RemoteJWKSetOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Options for the remote JSON Web Key Set.

## Properties

### \[customFetch\]?

• `optional` **\[customFetch\]**: [`FetchImplementation`](../type-aliases/FetchImplementation.md)

See [customFetch](../variables/customFetch.md).

***

### \[jwksCache\]?

• `optional` **\[jwksCache\]**: [`JWKSCacheInput`](../type-aliases/JWKSCacheInput.md)

See [jwksCache](../variables/jwksCache.md).

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

Headers to be sent with the HTTP request.

***

### timeoutDuration?

• `optional` **timeoutDuration**: `number`

Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
the verification will fail. Default is 5000 (5 seconds).
