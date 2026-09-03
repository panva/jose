# Function: composeGenerateKeyPair()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeGenerateKeyPair**\<`Factories`\>(...`factories`): [`ComposedGenerateKeyPair`](../interfaces/ComposedGenerateKeyPair.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

Composes asymmetric key-pair generation from one or more algorithm factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`KeyPairAlgorithmSelection`](../../../../../algorithms/key/type-aliases/KeyPairAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique |

## Returns

[`ComposedGenerateKeyPair`](../interfaces/ComposedGenerateKeyPair.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/key'
import { composeGenerateKeyPair } from 'jose/composable/key/generate/keypair'

const generateKeyPair = composeGenerateKeyPair(Ed25519, ES256)
const { publicKey, privateKey } = await generateKeyPair('Ed25519')
```
