# Function: exportJWK

▸ **exportJWK**(`key`): `Promise`<[`JWK`](../interfaces/types.JWK.md)\>

Exports a runtime-specific key representation (KeyLike) to a JWK.

**`example`** Usage
```js
const privateJwk = await exportJWK(privateKey)
const publicJwk = await exportJWK(publicKey)

console.log(privateJwk)
console.log(publicJwk)
```

**`example`** ESM import
```js
import { exportJWK } from 'jose'
```

**`example`** CJS import
```js
const { exportJWK } = require('jose')
```

**`example`** Deno import
```js
import { exportJWK } from 'https://deno.land/x/jose@v4.1.4/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Key representation to export as JWK. |

#### Returns

`Promise`<[`JWK`](../interfaces/types.JWK.md)\>
