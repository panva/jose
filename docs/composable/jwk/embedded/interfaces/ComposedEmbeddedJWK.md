# Interface: ComposedEmbeddedJWK()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

An Embedded JWK resolver restricted to the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

▸ **ComposedEmbeddedJWK**(`protectedHeader?`, `token?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

An Embedded JWK resolver restricted to the selected JWS algorithms.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `protectedHeader?` | [`SelectedJWSHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\> |
| `token?` | [`SelectedFlattenedJWSInput`](../../../jwks/local/type-aliases/SelectedFlattenedJWSInput.md)\<`Algorithm`\> |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>
