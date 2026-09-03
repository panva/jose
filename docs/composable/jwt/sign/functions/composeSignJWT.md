# Function: composeSignJWT()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeSignJWT**\<`Factories`\>(...`algorithms`): [`SignJWTConstructor`](../interfaces/SignJWTConstructor.md)\<[`JWSAlgorithmOf`](../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

Composes a SignJWT constructor supporting the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWSAlgorithmSelection`](../../../../algorithms/jws/type-aliases/JWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`algorithms` | `Factories` — algorithm identifiers must be unique |

## Returns

[`SignJWTConstructor`](../interfaces/SignJWTConstructor.md)\<[`JWSAlgorithmOf`](../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeSignJWT } from 'jose/composable/jwt/sign'

const SignJWT = composeSignJWT(Ed25519, ES256)
const jwt = await new SignJWT({ sub: 'urn:example:subject' })
  .setProtectedHeader({ alg: 'Ed25519' })
  .sign(privateKey)
```
