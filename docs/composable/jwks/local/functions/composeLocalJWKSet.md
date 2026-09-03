# Function: composeLocalJWKSet()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeLocalJWKSet**\<`Factories`\>(...`factories`): [`ComposedCreateLocalJWKSet`](../interfaces/ComposedCreateLocalJWKSet.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

Composes local JWK Set resolution from one or more asymmetric JWS factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`AsymmetricJWSAlgorithmSelection`](../../../../algorithms/jws/type-aliases/AsymmetricJWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique |

## Returns

[`ComposedCreateLocalJWKSet`](../interfaces/ComposedCreateLocalJWKSet.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeLocalJWKSet } from 'jose/composable/jwks/local'
import { composeJwtVerify } from 'jose/composable/jwt/verify'

const jwtVerify = composeJwtVerify(Ed25519, ES256)
const createLocalJWKSet = composeLocalJWKSet(Ed25519, ES256)
const JWKS = createLocalJWKSet(jwks)
const { payload } = await jwtVerify(jwt, JWKS)
```
