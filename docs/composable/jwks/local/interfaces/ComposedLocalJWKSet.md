# Interface: ComposedLocalJWKSet()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A local JWK Set resolver restricted to the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

▸ **ComposedLocalJWKSet**(`protectedHeader?`, `token?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

A local JWK Set resolver restricted to the selected JWS algorithms.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `protectedHeader?` | [`SelectedJWSHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\> |
| `token?` | [`SelectedFlattenedJWSInput`](../type-aliases/SelectedFlattenedJWSInput.md)\<`Algorithm`\> |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

## Properties

### jwks

• **jwks**: () => [`JSONWebKeySet`](../../../../types/interfaces/JSONWebKeySet.md)

#### Returns

[`JSONWebKeySet`](../../../../types/interfaces/JSONWebKeySet.md)
