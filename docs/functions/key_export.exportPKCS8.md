# Function: exportPKCS8

▸ **exportPKCS8**(`key`): `Promise`<`string`\>

Exports a runtime-specific private key representation (KeyObject or CryptoKey) to an PEM-encoded PKCS8 string format.

**`example`** Usage
```js
const pkcs8Pem = await exportPKCS8(privateKey)

console.log(pkcs8Pem)
```

**`example`** ESM import
```js
import { exportPKCS8 } from 'jose'
```

**`example`** CJS import
```js
const { exportPKCS8 } = require('jose')
```

**`example`** Deno import
```js
import { exportPKCS8 } from 'https://deno.land/x/jose@v4.0.1/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Key representation to transform to an PEM-encoded PKCS8 string format. |

#### Returns

`Promise`<`string`\>
