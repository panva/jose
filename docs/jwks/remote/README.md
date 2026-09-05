# jwks/remote

Verification using a JSON Web Key Set (JWKS) available on an HTTP(S) URL

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ExportedJWKSCache](interfaces/ExportedJWKSCache.md) | Shape of an externally persisted remote JWKS cache. |
| [RemoteJWKSet](interfaces/RemoteJWKSet.md) | A key resolver created by [createRemoteJWKSet](functions/createRemoteJWKSet.md). |
| [RemoteJWKSetOptions](interfaces/RemoteJWKSetOptions.md) | Remote JWKS resolver options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [FetchImplementation](type-aliases/FetchImplementation.md) | Custom fetch function. Must return HTTP 200 with a JSON JWKS. See [customFetch](variables/customFetch.md). |
| [JWKSCacheInput](type-aliases/JWKSCacheInput.md) | Values accepted by the [jwksCache](variables/jwksCache.md) option. |

## Variables

| Variable | Description |
| ------ | ------ |
| [customFetch](variables/customFetch.md) | Configures a custom fetch implementation for remote JWKS retrieval. |
| [jwksCache](variables/jwksCache.md) | Symbol used to configure an externally persisted remote JWKS cache. |

## Functions

| Function | Description |
| ------ | ------ |
| [createRemoteJWKSet](functions/createRemoteJWKSet.md) | Creates a resolver for a JSON Web Key Set available at an HTTP(S) URL. Fetches the JSON Web Key Set when the cache is missing or stale. An unmatched key triggers another fetch only when `cooldownDuration` has elapsed since the last successful fetch. Selection uses the header's "alg" and "kid" and respects the JWK's "use" and "key_ops". Exactly one key must match. |
