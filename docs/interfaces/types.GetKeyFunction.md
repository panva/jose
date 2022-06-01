# Interface: GetKeyFunction<T, T2\>

[💗 Help the project](https://github.com/sponsors/panva)

## Type parameters

| Name |
| :------ |
| `T` |
| `T2` |

## Callable

### GetKeyFunction

▸ **GetKeyFunction**(`protectedHeader`, `token`): `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) \| `Promise`<`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md)\>

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | `T` | JWE or JWS Protected Header. |
| `token` | `T2` | The consumed JWE or JWS token. |

#### Returns

`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) \| `Promise`<`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md)\>
