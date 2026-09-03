# Function: composeRemoteJWKSet()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeRemoteJWKSet**\<`Factories`\>(...`factories`): [`ComposedCreateRemoteJWKSet`](../interfaces/ComposedCreateRemoteJWKSet.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

Composes remote JWK Set resolution from one or more asymmetric JWS factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`AsymmetricJWSAlgorithmSelection`](../../../../algorithms/jws/type-aliases/AsymmetricJWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique |

## Returns

[`ComposedCreateRemoteJWKSet`](../interfaces/ComposedCreateRemoteJWKSet.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeRemoteJWKSet } from 'jose/composable/jwks/remote'
import { composeJwtVerify } from 'jose/composable/jwt/verify'

const jwtVerify = composeJwtVerify(Ed25519, ES256)
const createRemoteJWKSet = composeRemoteJWKSet(Ed25519, ES256)
const JWKS = createRemoteJWKSet(new URL('https://example.com/.well-known/jwks.json'))
const { payload } = await jwtVerify(jwt, JWKS)
```
