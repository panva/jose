# Function: composeEncryptJWT()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeEncryptJWT**\<`Factories`\>(...`factories`): [`ComposedEncryptJWTConstructor`](../interfaces/ComposedEncryptJWTConstructor.md)\<[`ComposedJWTHeader`](../type-aliases/ComposedJWTHeader.md)\<`Factories`\>\>

Composes an encrypted JWT producer class from the selected JWE algorithm factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique and the selection must include at least one key-management and one content-encryption factory |

## Returns

[`ComposedEncryptJWTConstructor`](../interfaces/ComposedEncryptJWTConstructor.md)\<[`ComposedJWTHeader`](../type-aliases/ComposedJWTHeader.md)\<`Factories`\>\>

## Example

```js
import { dir } from 'jose/algorithms/jwe'
import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
import { composeEncryptJWT } from 'jose/composable/jwt/encrypt'

const EncryptJWT = composeEncryptJWT(dir, A256GCM, A256CBC_HS512)
const secretKey = crypto.getRandomValues(new Uint8Array(32))
const jwt = await new EncryptJWT({ sub: 'urn:example:subject' })
  .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
  .encrypt(secretKey)
```
