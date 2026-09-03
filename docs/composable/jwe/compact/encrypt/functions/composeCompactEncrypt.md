# Function: composeCompactEncrypt()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeCompactEncrypt**\<`Factories`\>(...`factories`): [`ComposedCompactEncryptConstructor`](../interfaces/ComposedCompactEncryptConstructor.md)\<[`ComposedCompactJWEHeader`](../../../../jwt/decrypt/interfaces/ComposedCompactJWEHeader.md)\<`Factories`\>\>

Composes a Compact JWE encryptor class from the selected JWE algorithm factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique and the selection must include at least one key-management and one content-encryption factory |

## Returns

[`ComposedCompactEncryptConstructor`](../interfaces/ComposedCompactEncryptConstructor.md)\<[`ComposedCompactJWEHeader`](../../../../jwt/decrypt/interfaces/ComposedCompactJWEHeader.md)\<`Factories`\>\>

## Example

```js
import { dir } from 'jose/algorithms/jwe'
import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
import { composeCompactEncrypt } from 'jose/composable/jwe/compact/encrypt'

const CompactEncrypt = composeCompactEncrypt(dir, A256GCM, A256CBC_HS512)
const plaintext = new TextEncoder().encode("It's a secret")
const secret = crypto.getRandomValues(new Uint8Array(32))

const jwe = await new CompactEncrypt(plaintext)
  .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
  .encrypt(secret)
```
