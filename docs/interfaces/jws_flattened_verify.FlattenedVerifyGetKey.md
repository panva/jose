# Interface: FlattenedVerifyGetKey

[jws/flattened/verify](../modules/jws_flattened_verify.md).FlattenedVerifyGetKey

## Hierarchy

- [`GetKeyFunction`](types.GetKeyFunction.md)<[`JWSHeaderParameters`](types.JWSHeaderParameters.md) \| `undefined`, [`FlattenedJWSInput`](types.FlattenedJWSInput.md)\>

  ↳ **`FlattenedVerifyGetKey`**

## Callable

### FlattenedVerifyGetKey

▸ **FlattenedVerifyGetKey**(`protectedHeader`, `token`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Interface for Flattened JWS Verification dynamic key resolution.
No token components have been verified at the time of this function call.

See [createRemoteJWKSet](../functions/jwks_remote.createremotejwkset.md#function-createremotejwkset)
to verify using a remote JSON Web Key Set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | `undefined` \| [`JWSHeaderParameters`](types.JWSHeaderParameters.md) |
| `token` | [`FlattenedJWSInput`](types.FlattenedJWSInput.md) |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[types.d.ts:81](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L81)
