# Interface: JWTDecryptGetKey()\<KeyType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Interface for JWT Decryption dynamic key resolution. No token components have been verified at
the time of this function call.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `KeyType` *extends* [`CryptoKey`](../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`CryptoKey`](../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |

▸ **JWTDecryptGetKey**(`protectedHeader`, `token`): [`KeyObject`](../../../types/interfaces/KeyObject.md) \| [`JWK`](../../../types/type-aliases/JWK.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`KeyObject`](../../../types/interfaces/KeyObject.md) \| [`JWK`](../../../types/type-aliases/JWK.md) \| `KeyType`\>

Dynamic key resolution function. No token components have been verified at the time of this
function call.

If a suitable key for the token cannot be matched, throw an error instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`CompactJWEHeaderParameters`](../../../types/interfaces/CompactJWEHeaderParameters.md) | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWE`](../../../types/interfaces/FlattenedJWE.md) | The consumed JWE or JWS token. |

## Returns

[`KeyObject`](../../../types/interfaces/KeyObject.md) \| [`JWK`](../../../types/type-aliases/JWK.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`KeyObject`](../../../types/interfaces/KeyObject.md) \| [`JWK`](../../../types/type-aliases/JWK.md) \| `KeyType`\>
