# Interface: CompactVerifyGetKey()\<KeyType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Resolves a key for Compact JWS verification from unverified headers and token data.

## See

[createRemoteJWKSet](../../../../jwks/remote/functions/createRemoteJWKSet.md) to verify using a remote JSON Web Key Set.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `KeyType` *extends* [`CryptoKey`](../../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`CryptoKey`](../../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Type definition of the keys the function resolves. Narrowing it is what lets [ResolvedKey.key](../../../../types/interfaces/ResolvedKey.md#key) be inferred at the call site. |

▸ **CompactVerifyGetKey**(`protectedHeader`, `token`): [`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType`\>

Resolves a key for an unverified token. Throw if no suitable key can be resolved.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`CompactJWSHeaderParameters`](../../../../types/interfaces/CompactJWSHeaderParameters.md) | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWSInput`](../../../../types/interfaces/FlattenedJWSInput.md) | The consumed JWE or JWS token; none of its components have been verified. |

## Returns

[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md) \| `KeyType`\>
