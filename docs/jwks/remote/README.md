# jwks/remote

Verification using a JSON Web Key Set (JWKS) available on an HTTP(S) URL

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ExportedJWKSCache](interfaces/ExportedJWKSCache.md) | See [jwksCache](variables/jwksCache.md). |
| [RemoteJWKSet](interfaces/RemoteJWKSet.md) | The key resolution function returned by [createRemoteJWKSet](functions/createRemoteJWKSet.md). |
| [RemoteJWKSetOptions](interfaces/RemoteJWKSetOptions.md) | Options for the remote JSON Web Key Set. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [FetchImplementation](type-aliases/FetchImplementation.md) | See [customFetch](variables/customFetch.md). |
| [JWKSCacheInput](type-aliases/JWKSCacheInput.md) | See [jwksCache](variables/jwksCache.md). |

## Variables

| Variable | Description |
| ------ | ------ |
| [customFetch](variables/customFetch.md) | When passed to [createRemoteJWKSet](functions/createRemoteJWKSet.md) this allows the resolver to make use of advanced fetch configurations, HTTP Proxies, retry on network errors, etc. |
| [jwksCache](variables/jwksCache.md) | **Warning:** This option has security implications that must be understood, assessed for applicability, and accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own code. |

## Functions

| Function | Description |
| ------ | ------ |
| [createRemoteJWKSet](functions/createRemoteJWKSet.md) | Returns a function that resolves a JWS JOSE Header to a public key object downloaded from a remote endpoint returning a JSON Web Key Set, that is, for example, an OAuth 2.0 or OIDC jwks_uri. The JSON Web Key Set is fetched when no key matches the selection process but only as frequently as the `cooldownDuration` option allows to prevent abuse. Selection respects the header's "alg" (Algorithm) and "kid" (Key ID) as well as the JWK's "use" (Public Key Use) and "key_ops" (Key Operations). Exactly one key must match; if multiple keys match, the thrown `JWKSMultipleMatchingKeys` can be iterated. |
