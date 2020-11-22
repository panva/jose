# Interface: JWTVerifyGetKey

Interface for JWT Verification dynamic key resolution.
No token components have been verified at the time of this function call.

## Callable

▸ (`protectedHeader`: [JWSHeaderParameters](_types_d_.jwsheaderparameters.md), `token`: [FlattenedJWSInput](_types_d_.flattenedjwsinput.md)): Promise\<[KeyLike](../types/_types_d_.keylike.md)>

*Defined in [src/types.d.ts:75](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L75)*

Interface for JWT Verification dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters:

Name | Type |
------ | ------ |
`protectedHeader` | [JWSHeaderParameters](_types_d_.jwsheaderparameters.md) |
`token` | [FlattenedJWSInput](_types_d_.flattenedjwsinput.md) |

**Returns:** Promise\<[KeyLike](../types/_types_d_.keylike.md)>
