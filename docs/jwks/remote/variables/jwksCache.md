# Variable: jwksCache

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• `const` **jwksCache**: unique `symbol`

> [!WARNING]\
> This option has security implications that must be understood, assessed for applicability, and
> accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own
> code.

This option is intended for cloud computing runtimes that cannot keep an in memory cache between
their code's invocations. Use in runtimes where an in memory cache between requests is available
is not desirable.

When passed to [createRemoteJWKSet](../functions/createRemoteJWKSet.md) this allows the passed in
object to:

- Serve as an initial value for the JSON Web Key Set that the module would otherwise need to
  trigger an HTTP request for
- Have the JSON Web Key Set the function optionally ended up triggering an HTTP request for
  assigned to it as properties

The intended use pattern is:

- Before verifying with [createRemoteJWKSet](../functions/createRemoteJWKSet.md) you pull the
  previously cached object from a low-latency key-value store offered by the cloud computing
  runtime it is executed on;
- Default to an empty object `{}` instead when there's no previously cached value;
- Pass it in as [\[jwksCache\]](../interfaces/RemoteJWKSetOptions.md);
- Afterwards, update the key-value storage if the [`uat`](../interfaces/ExportedJWKSCache.md#uat) property of
  the object has changed.

## Example

```ts
// Prerequisites
let url!: URL
let jwt!: string
let getPreviouslyCachedJWKS!: () => Promise<jose.ExportedJWKSCache>
let storeNewJWKScache!: (cache: jose.ExportedJWKSCache) => Promise<void>

// Load JSON Web Key Set cache
const jwksCache: jose.JWKSCacheInput = (await getPreviouslyCachedJWKS()) || {}
const { uat } = jwksCache

const JWKS = jose.createRemoteJWKSet(url, {
  [jose.jwksCache]: jwksCache,
})

// Use JSON Web Key Set cache
await jose.jwtVerify(jwt, JWKS)

if (uat !== jwksCache.uat) {
  // Update JSON Web Key Set cache
  await storeNewJWKScache(jwksCache)
}
```
