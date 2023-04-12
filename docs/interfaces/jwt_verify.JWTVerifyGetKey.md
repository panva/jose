# Interface: JWTVerifyGetKey

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

## Callable

### JWTVerifyGetKey

▸ **JWTVerifyGetKey**(`protectedHeader`, `token`): [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) \| [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md)\>

Interface for JWT Verification dynamic key resolution. No token components have been verified at
the time of this function call.

**`see`** [createRemoteJWKSet](../functions/jwks_remote.createRemoteJWKSet.md#function-createremotejwkset) to verify using a remote JSON Web Key Set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `protectedHeader` | [`JWTHeaderParameters`](types.JWTHeaderParameters.md) |
| `token` | [`FlattenedJWSInput`](types.FlattenedJWSInput.md) |

#### Returns

[`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) \| [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md)\>
