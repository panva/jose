# Function: exportSPKI

▸ **exportSPKI**(`key`): `Promise`<`string`\>

Exports a runtime-specific public key representation (KeyObject or CryptoKey) to an PEM-encoded SPKI string format.

**`example`** Usage
```js
const spkiPem = await exportSPKI(publicKey)

console.log(spkiPem)
```

**`example`** ESM import
```js
import { exportSPKI } from 'jose'
```

**`example`** CJS import
```js
const { exportSPKI } = require('jose')
```

**`example`** Deno import
```js
import { exportSPKI } from 'https://deno.land/x/jose@v4.1.1/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Key representation to transform to an PEM-encoded SPKI string format. |

#### Returns

`Promise`<`string`\>
