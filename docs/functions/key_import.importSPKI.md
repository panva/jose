# Function: importSPKI

▸ **importSPKI**(`spki`, `alg`, `options?`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Imports an PEM-encoded SPKI string as a runtime-specific public key representation (KeyObject or CryptoKey).
See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210) to learn about key to algorithm
requirements and mapping.

**`example`** Usage
```js
const algorithm = 'ES256'
const spki = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
-----END PUBLIC KEY-----`
const ecPublicKey = await importSPKI(spki, algorithm)
```

**`example`** ESM import
```js
import { importSPKI } from 'jose'
```

**`example`** CJS import
```js
const { importSPKI } = require('jose')
```

**`example`** Deno import
```js
import { importSPKI } from 'https://deno.land/x/jose@v4.2.1/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spki` | `string` | - |
| `alg` | `string` | JSON Web Algorithm identifier to be used with the imported key. |
| `options?` | [`PEMImportOptions`](../interfaces/key_import.PEMImportOptions.md) | - |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>
