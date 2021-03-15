# Interface: CompactVerifyGetKey

[jws/compact/verify](../modules/jws_compact_verify.md).CompactVerifyGetKey

Interface for Compact JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

## Hierarchy

* [*GetKeyFunction*](types.getkeyfunction.md)<[*JWSHeaderParameters*](types.jwsheaderparameters.md), [*FlattenedJWSInput*](types.flattenedjwsinput.md)\>

  ↳ **CompactVerifyGetKey**

## Callable

▸ **CompactVerifyGetKey**(`protectedHeader`: [*JWSHeaderParameters*](types.jwsheaderparameters.md), `token`: [*FlattenedJWSInput*](types.flattenedjwsinput.md)): *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Interface for Compact JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters:

Name | Type |
:------ | :------ |
`protectedHeader` | [*JWSHeaderParameters*](types.jwsheaderparameters.md) |
`token` | [*FlattenedJWSInput*](types.flattenedjwsinput.md) |

**Returns:** *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Defined in: [types.d.ts:79](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L79)
