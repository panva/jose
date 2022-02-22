# Interface: GetKeyFunction<T, T2\>

## Type parameters

| Name |
| :------ |
| `T` |
| `T2` |

## Callable

### GetKeyFunction

▸ **GetKeyFunction**(`protectedHeader`, `token`): [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` \| `Promise`<[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array`\>

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | `T` | JWE or JWS Protected Header. |
| `token` | `T2` | The consumed JWE or JWS token. |

#### Returns

[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` \| `Promise`<[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array`\>
