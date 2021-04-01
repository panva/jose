# Interface: GetKeyFunction<T, T2\>

[types](../modules/types.md).GetKeyFunction

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

## Type parameters

Name |
:------ |
`T` |
`T2` |

## Hierarchy

* **GetKeyFunction**

  ↳ [*JWTDecryptGetKey*](jwt_decrypt.jwtdecryptgetkey.md)

  ↳ [*JWTVerifyGetKey*](jwt_verify.jwtverifygetkey.md)

  ↳ [*CompactDecryptGetKey*](jwe_compact_decrypt.compactdecryptgetkey.md)

  ↳ [*FlattenedDecryptGetKey*](jwe_flattened_decrypt.flatteneddecryptgetkey.md)

  ↳ [*GeneralDecryptGetKey*](jwe_general_decrypt.generaldecryptgetkey.md)

  ↳ [*CompactVerifyGetKey*](jws_compact_verify.compactverifygetkey.md)

  ↳ [*FlattenedVerifyGetKey*](jws_flattened_verify.flattenedverifygetkey.md)

  ↳ [*GeneralVerifyGetKey*](jws_general_verify.generalverifygetkey.md)

## Callable

▸ **GetKeyFunction**(`protectedHeader`: T, `token`: T2): *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Generic Interface for consuming operations dynamic key resolution.
No token components have been verified at the time of this function call.

If you cannot match a key suitable for the token, throw an error instead.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`protectedHeader` | T | JWE or JWS Protected Header.   |
`token` | T2 | The consumed JWE or JWS token.    |

**Returns:** *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Defined in: [types.d.ts:78](https://github.com/panva/jose/blob/v3.11.3/src/types.d.ts#L78)
