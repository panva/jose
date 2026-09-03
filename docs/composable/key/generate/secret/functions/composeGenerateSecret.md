# Function: composeGenerateSecret()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeGenerateSecret**\<`Factories`\>(...`factories`): [`ComposedGenerateSecret`](../interfaces/ComposedGenerateSecret.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

Composes symmetric secret generation from one or more algorithm factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`SecretAlgorithmSelection`](../../../../../algorithms/key/type-aliases/SecretAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique |

## Returns

[`ComposedGenerateSecret`](../interfaces/ComposedGenerateSecret.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

## Example

```js
import { A256CBC_HS512, A256GCM } from 'jose/algorithms/key'
import { composeGenerateSecret } from 'jose/composable/key/generate/secret'

const generateSecret = composeGenerateSecret(A256GCM, A256CBC_HS512)
const gcmKey = await generateSecret('A256GCM')
const cbcHmacKey = await generateSecret('A256CBC-HS512')
```
