# Interface: SDJWTIssuerGetKey()\<KeyType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Dynamically resolves an SD-JWT Issuer signature verification key. No token component has been
verified when this callback runs. The resolver must securely establish that the returned key
belongs to the expected Issuer; an attacker-controlled `kid`, `iss`, or key URL is not a trust
decision.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `KeyType` *extends* [`CryptoKey`](../type-aliases/CryptoKey.md) | [`CryptoKey`](../type-aliases/CryptoKey.md) | Type definition of the keys the function resolves. Narrowing it is what lets [ResolvedKey.key](ResolvedKey.md#key) be inferred at the call site. |

▸ **SDJWTIssuerGetKey**(`protectedHeader`, `token`): [`JWK`](../type-aliases/JWK.md) \| [`KeyObject`](KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../type-aliases/JWK.md) \| [`KeyObject`](KeyObject.md) \| `KeyType`\>

Dynamic key resolution function. No token components have been verified at the time of this
function call. If a suitable key for the token cannot be matched, throw an error instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](JWSHeaderParameters.md) | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWSInput`](FlattenedJWSInput.md) | The consumed JWE or JWS token. |

## Returns

[`JWK`](../type-aliases/JWK.md) \| [`KeyObject`](KeyObject.md) \| `KeyType` \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWK`](../type-aliases/JWK.md) \| [`KeyObject`](KeyObject.md) \| `KeyType`\>
