# Interface: FlattenedVerifyGetKey

[jws/flattened/verify](../modules/jws_flattened_verify.md).FlattenedVerifyGetKey

Interface for Flattened JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createremotejwkset.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

## Hierarchy

* [*GetKeyFunction*](types.getkeyfunction.md)<[*JWSHeaderParameters*](types.jwsheaderparameters.md) \| undefined, [*FlattenedJWSInput*](types.flattenedjwsinput.md)\>

  ↳ **FlattenedVerifyGetKey**

## Callable

▸ **FlattenedVerifyGetKey**(`protectedHeader`: *undefined* \| [*JWSHeaderParameters*](types.jwsheaderparameters.md), `token`: [*FlattenedJWSInput*](types.flattenedjwsinput.md)): *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Interface for Flattened JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createremotejwkset.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

#### Parameters:

Name | Type |
:------ | :------ |
`protectedHeader` | *undefined* \| [*JWSHeaderParameters*](types.jwsheaderparameters.md) |
`token` | [*FlattenedJWSInput*](types.flattenedjwsinput.md) |

**Returns:** *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Defined in: [types.d.ts:78](https://github.com/panva/jose/blob/v3.11.5/src/types.d.ts#L78)
