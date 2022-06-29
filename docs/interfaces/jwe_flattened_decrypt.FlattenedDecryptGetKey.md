# Interface: FlattenedDecryptGetKey

[💗 Help the project](https://github.com/sponsors/panva)

## Callable

### FlattenedDecryptGetKey

▸ **FlattenedDecryptGetKey**(`protectedHeader`, `token`): `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) \| `Promise`<`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md)\>

Interface for Flattened JWE Decryption dynamic key resolution. No token components have been
verified at the time of this function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | `undefined` \| [`JWEHeaderParameters`](types.JWEHeaderParameters.md) |
| `token` | [`FlattenedJWE`](types.FlattenedJWE.md) |

#### Returns

`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) \| `Promise`<`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md)\>
