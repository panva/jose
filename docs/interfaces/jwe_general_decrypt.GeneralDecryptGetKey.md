# Interface: GeneralDecryptGetKey

[jwe/general/decrypt](../modules/jwe_general_decrypt.md).GeneralDecryptGetKey

## Hierarchy

- [`GetKeyFunction`](types.GetKeyFunction.md)<[`JWEHeaderParameters`](types.JWEHeaderParameters.md), [`FlattenedJWE`](types.FlattenedJWE.md)\>

  ↳ **`GeneralDecryptGetKey`**

## Callable

### GeneralDecryptGetKey

▸ **GeneralDecryptGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Interface for General JWE Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](types.JWEHeaderParameters.md) |
| `token` | [`FlattenedJWE`](types.FlattenedJWE.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[types.d.ts:152](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L152)
