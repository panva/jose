# Function: generateKeyPair

[util/generate_key_pair](../modules/util_generate_key_pair.md).generateKeyPair

▸ **generateKeyPair**(`alg`, `options?`): `Promise`<[`GenerateKeyPairResult`](../interfaces/util_generate_key_pair.GenerateKeyPairResult.md)\>

Generates a private and a public key for a given JWA algorithm identifier.
This can only generate asymmetric key pairs. For symmetric secrets use the
`generateSecret` function.

Note: Under Web Cryptography API runtime the `privateKey` is generated with
`extractable` set to `false` by default.

**`example`** ESM import
```js
import { generateKeyPair } from 'jose/util/generate_key_pair'
```

**`example`** CJS import
```js
const { generateKeyPair } = require('jose/util/generate_key_pair')
```

**`example`** Deno import
```js
import { generateKeyPair } from 'https://deno.land/x/jose@v3.16.1/util/generate_key_pair.ts'
```

**`example`** Usage
```js
const { publicKey, privateKey } = await generateKeyPair('PS256')
console.log(publicKey)
console.log(privateKey)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `alg` | `string` | JWA Algorithm Identifier to be used with the generated key pair. |
| `options?` | [`GenerateKeyPairOptions`](../interfaces/util_generate_key_pair.GenerateKeyPairOptions.md) | Additional options passed down to the key pair generation. |

#### Returns

`Promise`<[`GenerateKeyPairResult`](../interfaces/util_generate_key_pair.GenerateKeyPairResult.md)\>

#### Defined in

[util/generate_key_pair.ts:71](https://github.com/panva/jose/blob/v3.16.1/src/util/generate_key_pair.ts#L71)
