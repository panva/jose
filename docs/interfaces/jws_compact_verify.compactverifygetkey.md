# Interface: CompactVerifyGetKey

[jws/compact/verify](../modules/jws_compact_verify.md).CompactVerifyGetKey

Interface for Compact JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createremotejwkset.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

## Hierarchy

- [*GetKeyFunction*](types.getkeyfunction.md)<[*JWSHeaderParameters*](types.jwsheaderparameters.md), [*FlattenedJWSInput*](types.flattenedjwsinput.md)\>

  ↳ **CompactVerifyGetKey**

## Callable

▸ **CompactVerifyGetKey**(`protectedHeader`: [*JWSHeaderParameters*](types.jwsheaderparameters.md), `token`: [*FlattenedJWSInput*](types.flattenedjwsinput.md)): *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Interface for Compact JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createremotejwkset.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [*JWSHeaderParameters*](types.jwsheaderparameters.md) |
| `token` | [*FlattenedJWSInput*](types.flattenedjwsinput.md) |

**Returns:** *Promise*<[*KeyLike*](../types/types.keylike.md)\>

Defined in: [types.d.ts:78](https://github.com/panva/jose/blob/v3.12.0/src/types.d.ts#L78)
