# Interface: CompactVerifyGetKey

Interface for Compact JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

## Callable

▸ (`protectedHeader`: [JWSHeaderParameters](_types_d_.jwsheaderparameters.md), `token`: [FlattenedJWSInput](_types_d_.flattenedjwsinput.md)): Promise<[KeyLike](../types/_types_d_.keylike.md)\>

*Defined in [src/types.d.ts:79](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L79)*

Interface for Compact JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters:

Name | Type |
------ | ------ |
`protectedHeader` | [JWSHeaderParameters](_types_d_.jwsheaderparameters.md) |
`token` | [FlattenedJWSInput](_types_d_.flattenedjwsinput.md) |

**Returns:** Promise<[KeyLike](../types/_types_d_.keylike.md)\>
