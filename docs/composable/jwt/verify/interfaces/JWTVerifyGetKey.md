# Interface: JWTVerifyGetKey()\<Algorithm, KeyType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Dynamic key resolver used by a composed JWT verifier.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Algorithm` *extends* `string` | - |
| `KeyType` *extends* [`JWSResolvedKey`](../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\> | [`JWSResolvedKey`](../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\> |

▸ **JWTVerifyGetKey**(`protectedHeader`, `token`): [`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType`\>

Dynamic key resolution function. No token components have been verified at the time of this
function call. If a suitable key for the token cannot be matched, throw an error instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`SelectedCompactJWSHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedCompactJWSHeaderParameters.md) | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWSInput`](../../../../types/interfaces/FlattenedJWSInput.md) | The consumed JWE or JWS token. |

## Returns

[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType`\>
