# Interface: GeneralVerifyGetKey

[jws/general/verify](../modules/jws_general_verify.md).GeneralVerifyGetKey

Interface for General JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

## Hierarchy

* [*GetKeyFunction*](types.getkeyfunction.md)<[*JWSHeaderParameters*](types.jwsheaderparameters.md), [*FlattenedJWSInput*](types.flattenedjwsinput.md)\>

  ↳ **GeneralVerifyGetKey**

## Callable

▸ **GeneralVerifyGetKey**(`protectedHeader`: [*JWSHeaderParameters*](types.jwsheaderparameters.md), `token`: [*FlattenedJWSInput*](types.flattenedjwsinput.md)): *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Interface for General JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters:

Name | Type |
:------ | :------ |
`protectedHeader` | [*JWSHeaderParameters*](types.jwsheaderparameters.md) |
`token` | [*FlattenedJWSInput*](types.flattenedjwsinput.md) |

**Returns:** *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Defined in: [types.d.ts:78](https://github.com/panva/jose/blob/main/src/types.d.ts#L78)
