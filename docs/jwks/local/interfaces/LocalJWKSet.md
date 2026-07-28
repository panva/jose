# Interface: LocalJWKSet()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

The key resolution function returned by [createLocalJWKSet](../functions/createLocalJWKSet.md).

## See

[jwtVerify](../../../jwt/verify/functions/jwtVerify.md) and the other consuming functions, all of which accept
  this directly.

▸ **LocalJWKSet**(`protectedHeader?`, `token?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

The key resolution function returned by [createLocalJWKSet](../functions/createLocalJWKSet.md).

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

### jwks

• **jwks**: () => [`JSONWebKeySet`](../../../types/interfaces/JSONWebKeySet.md)

Returns a structured clone of the JSON Web Key Set this resolver was created with.

#### Returns

[`JSONWebKeySet`](../../../types/interfaces/JSONWebKeySet.md)
