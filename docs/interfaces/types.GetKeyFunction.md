# Interface: GetKeyFunction<T, T2\>

[types](../modules/types.md).GetKeyFunction

## Type parameters

| Name |
| :------ |
| `T` |
| `T2` |

## Hierarchy

- **`GetKeyFunction`**

  ↳ [`JWTDecryptGetKey`](jwt_decrypt.JWTDecryptGetKey.md)

  ↳ [`JWTVerifyGetKey`](jwt_verify.JWTVerifyGetKey.md)

  ↳ [`CompactDecryptGetKey`](jwe_compact_decrypt.CompactDecryptGetKey.md)

  ↳ [`FlattenedDecryptGetKey`](jwe_flattened_decrypt.FlattenedDecryptGetKey.md)

  ↳ [`GeneralDecryptGetKey`](jwe_general_decrypt.GeneralDecryptGetKey.md)

  ↳ [`CompactVerifyGetKey`](jws_compact_verify.CompactVerifyGetKey.md)

  ↳ [`FlattenedVerifyGetKey`](jws_flattened_verify.FlattenedVerifyGetKey.md)

  ↳ [`GeneralVerifyGetKey`](jws_general_verify.GeneralVerifyGetKey.md)

## Callable

### GetKeyFunction

▸ **GetKeyFunction**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | `T` | JWE or JWS Protected Header. |
| `token` | `T2` | The consumed JWE or JWS token. |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[types.d.ts:152](https://github.com/panva/jose/blob/v3.15.0/src/types.d.ts#L152)
