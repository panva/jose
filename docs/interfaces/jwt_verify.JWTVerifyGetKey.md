# Interface: JWTVerifyGetKey

[💗 Help the project](https://github.com/sponsors/panva)

## Callable

### JWTVerifyGetKey

▸ **JWTVerifyGetKey**(`protectedHeader`, `token`): `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) \| `Promise`<`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md)\>

Interface for JWT Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWTHeaderParameters`](types.JWTHeaderParameters.md) |
| `token` | [`FlattenedJWSInput`](types.FlattenedJWSInput.md) |

#### Returns

`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) \| `Promise`<`Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md)\>
