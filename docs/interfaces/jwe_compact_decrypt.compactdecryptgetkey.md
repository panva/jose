# Interface: CompactDecryptGetKey

[jwe/compact/decrypt](../modules/jwe_compact_decrypt.md).CompactDecryptGetKey

Interface for Compact JWE Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

## Hierarchy

* [*GetKeyFunction*](types.getkeyfunction.md)<[*JWEHeaderParameters*](types.jweheaderparameters.md), [*FlattenedJWE*](types.flattenedjwe.md)\>

  ↳ **CompactDecryptGetKey**

## Callable

▸ **CompactDecryptGetKey**(`protectedHeader`: [*JWEHeaderParameters*](types.jweheaderparameters.md), `token`: [*FlattenedJWE*](types.flattenedjwe.md)): *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Interface for Compact JWE Decryption dynamic key resolution.
No token components have been verified at the time of this function call.

#### Parameters:

Name | Type |
:------ | :------ |
`protectedHeader` | [*JWEHeaderParameters*](types.jweheaderparameters.md) |
`token` | [*FlattenedJWE*](types.flattenedjwe.md) |

**Returns:** *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Defined in: [types.d.ts:79](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L79)
