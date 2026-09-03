# Function: composeFlattenedSign()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeFlattenedSign**\<`Factories`\>(...`algorithms`): [`FlattenedSignConstructor`](../interfaces/FlattenedSignConstructor.md)\<[`JWSAlgorithmOf`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

Composes a FlattenedSign constructor supporting the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWSAlgorithmSelection`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`algorithms` | `Factories` — algorithm identifiers must be unique |

## Returns

[`FlattenedSignConstructor`](../interfaces/FlattenedSignConstructor.md)\<[`JWSAlgorithmOf`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeFlattenedSign } from 'jose/composable/jws/flattened/sign'

const FlattenedSign = composeFlattenedSign(Ed25519, ES256)
const payload = new TextEncoder().encode('It\u2019s a dangerous business, Frodo.')
const jws = await new FlattenedSign(payload)
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)
```
