# Interface: RemoteJWKSet()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A key resolver created by [createRemoteJWKSet](../functions/createRemoteJWKSet.md).

## See

[jwtVerify](../../../jwt/verify/functions/jwtVerify.md) and the other consuming functions, all of which accept
  this directly.

▸ **RemoteJWKSet**(`protectedHeader?`, `token?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

A key resolver created by [createRemoteJWKSet](../functions/createRemoteJWKSet.md).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `protectedHeader?` | [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md) |
| `token?` | [`FlattenedJWSInput`](../../../types/interfaces/FlattenedJWSInput.md) |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

## See

[jwtVerify](../../../jwt/verify/functions/jwtVerify.md) and the other consuming functions, all of which accept
  this directly.

## Properties

### coolingDown

• `readonly` **coolingDown**: `boolean`

Whether the cooldown window following the last successful fetch is still in effect.

***

### fresh

• `readonly` **fresh**: `boolean`

Whether the currently cached JSON Web Key Set is within its
[RemoteJWKSetOptions.cacheMaxAge](RemoteJWKSetOptions.md#cachemaxage).

***

### jwks

• **jwks**: () => [`JSONWebKeySet`](../../../types/interfaces/JSONWebKeySet.md) \| `undefined`

Returns a structured clone of the cached JSON Web Key Set, or `undefined` before keys have been
fetched or seeded via [jwksCache](../variables/jwksCache.md).

#### Returns

[`JSONWebKeySet`](../../../types/interfaces/JSONWebKeySet.md) \| `undefined`

***

### reload

• **reload**: () => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Triggers a JSON Web Key Set fetch, bypassing
[the cooldown](RemoteJWKSetOptions.md#cooldownduration).

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### reloading

• `readonly` **reloading**: `boolean`

Whether a JSON Web Key Set fetch is currently in flight.
