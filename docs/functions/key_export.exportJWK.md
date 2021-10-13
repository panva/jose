# Function: exportJWK

[key/export](../modules/key_export.md).exportJWK

▸ **exportJWK**(`key`): `Promise`<[`JWK`](../interfaces/types.JWK.md)\>

Exports a runtime-specific key representation (KeyLike) to a JWK.

**`example`** ESM import
```js
import { exportJWK } from 'jose/key/export'
```

**`example`** CJS import
```js
const { exportJWK } = require('jose/key/export')
```

**`example`** Deno import
```js
import { exportJWK } from 'https://deno.land/x/jose@v3.20.2/key/export.ts'
```

**`example`** Usage
```js
const privateJwk = await exportJWK(privateKey)
const publicJwk = await exportJWK(publicKey)

console.log(privateJwk)
console.log(publicJwk)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Key representation to export as JWK. |

#### Returns

`Promise`<[`JWK`](../interfaces/types.JWK.md)\>
