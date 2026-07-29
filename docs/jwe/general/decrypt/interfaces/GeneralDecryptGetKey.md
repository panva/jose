# Interface: GeneralDecryptGetKey()\<KeyType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Interface for General JWE Decryption dynamic key resolution. No token components have been
verified at the time of this function call.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `KeyType` *extends* [`CryptoKey`](../../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`CryptoKey`](../../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Type definition of the keys the function resolves. Narrowing it is what lets [ResolvedKey.key](../../../../types/interfaces/ResolvedKey.md#key) be inferred at the call site. |

▸ **GeneralDecryptGetKey**(`protectedHeader`, `token`): [`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType`\>

Dynamic key resolution function. No token components have been verified at the time of this
function call. If a suitable key for the token cannot be matched, throw an error instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWEHeaderParameters`](../../../../types/interfaces/JWEHeaderParameters.md) \| `undefined` | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWE`](../../../../types/interfaces/FlattenedJWE.md) | The consumed JWE or JWS token. |

## Returns

[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType`\>
