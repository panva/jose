# Function: composeGeneralVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **composeGeneralVerify**\<`Factories`\>(...`algorithms`): [`GeneralVerifyFunction`](../interfaces/GeneralVerifyFunction.md)\<[`JWSAlgorithmOf`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

Composes a General JWS verifier supporting the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWSAlgorithmSelection`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmSelection.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`algorithms` | `Factories` — algorithm identifiers must be unique |

## Returns

[`GeneralVerifyFunction`](../interfaces/GeneralVerifyFunction.md)\<[`JWSAlgorithmOf`](../../../../../algorithms/jws/type-aliases/JWSAlgorithmOf.md)\<`Factories`\>\>

## Example

```js
import { Ed25519, ES256 } from 'jose/algorithms/jws'
import { composeGeneralVerify } from 'jose/composable/jws/general/verify'

const generalVerify = composeGeneralVerify(Ed25519, ES256)
const { payload, protectedHeader } = await generalVerify(jws, (header) =>
  header.alg === 'Ed25519' ? ed25519PublicKey : es256PublicKey,
)
```
