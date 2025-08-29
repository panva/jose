# Interface: JWTVerifyGetKey()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Interface for JWT Verification dynamic key resolution. No token components have been verified at
the time of this function call.

## See

[createRemoteJWKSet](../../../jwks/remote/functions/createRemoteJWKSet.md) to verify using a remote JSON Web Key Set.

▸ **JWTVerifyGetKey**(`protectedHeader`, `token`): [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md)\>

Dynamic key resolution function. No token components have been verified at the time of this
function call.

If a suitable key for the token cannot be matched, throw an error instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWTHeaderParameters`](../../../types/interfaces/JWTHeaderParameters.md) | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWSInput`](../../../types/interfaces/FlattenedJWSInput.md) | The consumed JWE or JWS token. |

## Returns

[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../types/interfaces/KeyObject.md)\>
