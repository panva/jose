# Interface: ComposedCreateRemoteJWKSet()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A remote JWK Set factory restricted to the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

▸ **ComposedCreateRemoteJWKSet**(`url`, `options?`): [`ComposedRemoteJWKSet`](ComposedRemoteJWKSet.md)\<`Algorithm`\>

A remote JWK Set factory restricted to the selected JWS algorithms.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | [`URL`](https://developer.mozilla.org/docs/Web/API/URL) |
| `options?` | [`RemoteJWKSetOptions`](../../../../jwks/remote/interfaces/RemoteJWKSetOptions.md) |

## Returns

[`ComposedRemoteJWKSet`](ComposedRemoteJWKSet.md)\<`Algorithm`\>
