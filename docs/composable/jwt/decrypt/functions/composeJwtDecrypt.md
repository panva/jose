# Function: composeJwtDecrypt()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeJwtDecrypt**\<`Factories`\>(...`factories`): [`ComposedJWTDecryptFunction`](../interfaces/ComposedJWTDecryptFunction.md)\<`Factories`\>

Composes a JWT decryptor from the selected JWE algorithm factories.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`factories` | `Factories` — algorithm identifiers must be unique and the selection must include at least one key-management and one content-encryption factory |

## Returns

[`ComposedJWTDecryptFunction`](../interfaces/ComposedJWTDecryptFunction.md)\<`Factories`\>

## Example

```js
import { dir } from 'jose/algorithms/jwe'
import { A256CBC_HS512, A256GCM } from 'jose/algorithms/jwe/enc'
import { composeJwtDecrypt } from 'jose/composable/jwt/decrypt'

const jwtDecrypt = composeJwtDecrypt(dir, A256GCM, A256CBC_HS512)
const { payload, protectedHeader } = await jwtDecrypt(jwt, secretKey)
```
