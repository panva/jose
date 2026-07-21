# Interface: SDJWTIssuerGetKey()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Dynamically resolves an SD-JWT Issuer signature verification key. No token component has been
verified when this callback runs. The resolver must securely establish that the returned key
belongs to the expected Issuer; an attacker-controlled `kid`, `iss`, or key URL is not a trust
decision.

▸ **SDJWTIssuerGetKey**(`protectedHeader`, `token`): [`SDJWTIssuerKey`](../type-aliases/SDJWTIssuerKey.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTIssuerKey`](../type-aliases/SDJWTIssuerKey.md)\>

Dynamic key resolution function. No token components have been verified at the time of this
function call.

If a suitable key for the token cannot be matched, throw an error instead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](JWSHeaderParameters.md) | JWE or JWS Protected Header. |
| `token` | [`FlattenedJWSInput`](FlattenedJWSInput.md) | The consumed JWE or JWS token. |

## Returns

[`SDJWTIssuerKey`](../type-aliases/SDJWTIssuerKey.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTIssuerKey`](../type-aliases/SDJWTIssuerKey.md)\>
