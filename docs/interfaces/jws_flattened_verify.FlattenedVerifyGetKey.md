# Interface: FlattenedVerifyGetKey

[jws/flattened/verify](../modules/jws_flattened_verify.md).FlattenedVerifyGetKey

## Callable

### FlattenedVerifyGetKey

▸ **FlattenedVerifyGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array`\>

Interface for Flattened JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | `undefined` \| [`JWSHeaderParameters`](types.JWSHeaderParameters.md) |
| `token` | [`FlattenedJWSInput`](types.FlattenedJWSInput.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array`\>
