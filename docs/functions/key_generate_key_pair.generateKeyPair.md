# Function: generateKeyPair

▸ **generateKeyPair**(`alg`, `options?`): `Promise`<[`GenerateKeyPairResult`](../interfaces/key_generate_key_pair.GenerateKeyPairResult.md)\>

Generates a private and a public key for a given JWA algorithm identifier.
This can only generate asymmetric key pairs. For symmetric secrets use the
`generateSecret` function.

Note: Under Web Cryptography API runtime the `privateKey` is generated with
`extractable` set to `false` by default.

**`example`** Usage
```js
const { publicKey, privateKey } = await generateKeyPair('PS256')
console.log(publicKey)
console.log(privateKey)
```

**`example`** ESM import
```js
import { generateKeyPair } from 'jose'
```

**`example`** CJS import
```js
const { generateKeyPair } = require('jose')
```

**`example`** Deno import
```js
import { generateKeyPair } from 'https://deno.land/x/jose@v4.1.4/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `alg` | `string` | JWA Algorithm Identifier to be used with the generated key pair. |
| `options?` | [`GenerateKeyPairOptions`](../interfaces/key_generate_key_pair.GenerateKeyPairOptions.md) | Additional options passed down to the key pair generation. |

#### Returns

`Promise`<[`GenerateKeyPairResult`](../interfaces/key_generate_key_pair.GenerateKeyPairResult.md)\>
