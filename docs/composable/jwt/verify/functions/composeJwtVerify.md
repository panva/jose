# Function: composeJwtVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeJwtVerify**\<`Factories`\>(...`algorithms`): [`JWTVerifyFunction`](../interfaces/JWTVerifyFunction.md)\<[`JWSAlgorithmOf`](../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

Composes a JWT verifier supporting the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWSAlgorithmSelection`](../../../../algorithms/jws/type-aliases/JWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`algorithms` | `Factories` — algorithm identifiers must be unique |

## Returns

[`JWTVerifyFunction`](../interfaces/JWTVerifyFunction.md)\<[`JWSAlgorithmOf`](../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeJwtVerify } from 'jose/composable/jwt/verify'

const jwtVerify = composeJwtVerify(Ed25519, ES256)
const { payload, protectedHeader } = await jwtVerify(jwt, publicKey)
```
