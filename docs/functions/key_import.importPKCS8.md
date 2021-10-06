# Function: importPKCS8

[key/import](../modules/key_import.md).importPKCS8

▸ **importPKCS8**(`pkcs8`, `alg`, `options?`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Imports an PEM-encoded PKCS8 string as a runtime-specific private key representation (KeyObject or CryptoKey).
See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210) to learn about key to algorithm
requirements and mapping. Encrypted keys are not supported.

**`example`** ESM import
```js
import { importPKCS8 } from 'jose/key/import'
```

**`example`** CJS import
```js
const { importPKCS8 } = require('jose/key/import')
```

**`example`** Deno import
```js
import { importPKCS8 } from 'https://deno.land/x/jose@v3.20.1/key/import.ts'
```

**`example`** Usage
```js
const algorithm = 'ES256'
const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
-----END PRIVATE KEY-----`
const ecPrivateKey = await importPKCS8(pkcs8, algorithm)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pkcs8` | `string` | - |
| `alg` | `string` | JSON Web Algorithm identifier to be used with the imported key. |
| `options?` | [`PEMImportOptions`](../interfaces/key_import.PEMImportOptions.md) | - |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>
