# Interface: JWTDecryptGetKey

[jwt/decrypt](../modules/jwt_decrypt.md).JWTDecryptGetKey

## Hierarchy

- [`GetKeyFunction`](types.GetKeyFunction.md)<[`JWEHeaderParameters`](types.JWEHeaderParameters.md), [`FlattenedJWE`](types.FlattenedJWE.md)\>

  ↳ **`JWTDecryptGetKey`**

## Callable

### JWTDecryptGetKey

▸ **JWTDecryptGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Interface for JWT Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWEHeaderParameters`](types.JWEHeaderParameters.md) |
| `token` | [`FlattenedJWE`](types.FlattenedJWE.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[types.d.ts:152](https://github.com/panva/jose/blob/v3.15.3/src/types.d.ts#L152)
