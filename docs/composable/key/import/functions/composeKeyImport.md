# Function: composeKeyImport()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeKeyImport**\<`Factories`\>(...`factories`): [`ComposedKeyImport`](../interfaces/ComposedKeyImport.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

Composes key import functions from one or more key algorithm factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`KeyImportAlgorithmSelection`](../../../../algorithms/key/type-aliases/KeyImportAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique |

## Returns

[`ComposedKeyImport`](../interfaces/ComposedKeyImport.md)\<[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`Factories`\[`number`\]\>\[`"algorithm"`\]\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/key'
import { composeKeyImport } from 'jose/composable/key/import'

const { importPKCS8, importSPKI } = composeKeyImport(Ed25519, ES256)
const privateKey = await importPKCS8(pkcs8, 'Ed25519')
const publicKey = await importSPKI(spki, 'ES256')
```
