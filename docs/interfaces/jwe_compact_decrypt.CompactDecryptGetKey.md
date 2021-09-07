# Interface: CompactDecryptGetKey

[jwe/compact/decrypt](../modules/jwe_compact_decrypt.md).CompactDecryptGetKey

## Hierarchy

- [`GetKeyFunction`](types.GetKeyFunction.md)<[`JWEHeaderParameters`](types.JWEHeaderParameters.md), [`FlattenedJWE`](types.FlattenedJWE.md)\>

  ↳ **`CompactDecryptGetKey`**

## Callable

### CompactDecryptGetKey

▸ **CompactDecryptGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Interface for Compact JWE Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](types.JWEHeaderParameters.md) |
| `token` | [`FlattenedJWE`](types.FlattenedJWE.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[types.d.ts:152](https://github.com/panva/jose/blob/v3.16.0/src/types.d.ts#L152)
