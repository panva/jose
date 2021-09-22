# Function: exportSPKI

[key/export](../modules/key_export.md).exportSPKI

▸ **exportSPKI**(`key`): `Promise`<`string`\>

Exports a runtime-specific public key representation (KeyObject or CryptoKey) to an PEM-encoded SPKI string format.

**`example`** ESM import
```js
import { exportSPKI } from 'jose/key/export'
```

**`example`** CJS import
```js
const { exportSPKI } = require('jose/key/export')
```

**`example`** Deno import
```js
import { exportSPKI } from 'https://deno.land/x/jose@v3.18.0/key/export.ts'
```

**`example`** Usage
```js
const spkiPem = await exportSPKI(publicKey)

console.log(spkiPem)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Exclude`<[`KeyLike`](../types/types.KeyLike.md), `Uint8Array`\> | Key representation to transform to an PEM-encoded SPKI string format. |

#### Returns

`Promise`<`string`\>

#### Defined in

[key/export.ts:34](https://github.com/panva/jose/blob/v3.18.0/src/key/export.ts#L34)
