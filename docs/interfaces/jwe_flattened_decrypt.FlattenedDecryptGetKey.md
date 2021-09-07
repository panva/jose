# Interface: FlattenedDecryptGetKey

[jwe/flattened/decrypt](../modules/jwe_flattened_decrypt.md).FlattenedDecryptGetKey

## Hierarchy

- [`GetKeyFunction`](types.GetKeyFunction.md)<[`JWEHeaderParameters`](types.JWEHeaderParameters.md) \| `undefined`, [`FlattenedJWE`](types.FlattenedJWE.md)\>

  ↳ **`FlattenedDecryptGetKey`**

## Callable

### FlattenedDecryptGetKey

▸ **FlattenedDecryptGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Interface for Flattened JWE Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | `undefined` \| [`JWEHeaderParameters`](types.JWEHeaderParameters.md) |
| `token` | [`FlattenedJWE`](types.FlattenedJWE.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[types.d.ts:152](https://github.com/panva/jose/blob/v3.16.0/src/types.d.ts#L152)
