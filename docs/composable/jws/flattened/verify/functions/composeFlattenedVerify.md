# Function: composeFlattenedVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeFlattenedVerify**\<`Factories`\>(...`algorithms`): [`FlattenedVerifyFunction`](../interfaces/FlattenedVerifyFunction.md)\<[`JWSAlgorithmOf`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

Composes a Flattened JWS verifier supporting the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWSAlgorithmSelection`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`algorithms` | `Factories` — algorithm identifiers must be unique |

## Returns

[`FlattenedVerifyFunction`](../interfaces/FlattenedVerifyFunction.md)\<[`JWSAlgorithmOf`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeFlattenedVerify } from 'jose/composable/jws/flattened/verify'

const flattenedVerify = composeFlattenedVerify(Ed25519, ES256)
const { payload, protectedHeader } = await flattenedVerify(jws, publicKey)
```
