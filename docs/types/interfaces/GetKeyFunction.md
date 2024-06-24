# Interface: GetKeyFunction()\<IProtectedHeader, IToken\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Generic Interface for consuming operations dynamic key resolution.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `IProtectedHeader` | Type definition of the JWE or JWS Protected Header. |
| `IToken` | Type definition of the consumed JWE or JWS token. |

▸ **GetKeyFunction**(`protectedHeader`, `token`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../type-aliases/KeyLike.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../type-aliases/KeyLike.md)\>

Generic Interface for consuming operations dynamic key resolution.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | `IProtectedHeader` | JWE or JWS Protected Header. |
| `token` | `IToken` | The consumed JWE or JWS token. |

## Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../type-aliases/KeyLike.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../type-aliases/KeyLike.md)\>
