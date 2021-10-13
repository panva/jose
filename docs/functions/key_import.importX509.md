# Function: importX509

▸ **importX509**(`x509`, `alg`, `options?`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Imports the SPKI from an X.509 string certificate as a runtime-specific public key representation (KeyObject or CryptoKey).
See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210) to learn about key to algorithm
requirements and mapping.

**`example`** Usage
```js
const algorithm = 'ES256'
const x509 = `-----BEGIN CERTIFICATE-----
MIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np
QXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw
OTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN
VWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI
KoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35
UH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA
1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh
v+A1QWZMuTWqYt+uh/YSRNDn
-----END CERTIFICATE-----`
const ecPublicKey = await importX509(x509, algorithm)
```

**`example`** ESM import
```js
import { importX509 } from 'jose'
```

**`example`** CJS import
```js
const { importX509 } = require('jose')
```

**`example`** Deno import
```js
import { importX509 } from 'https://deno.land/x/jose@v3.20.3/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x509` | `string` | - |
| `alg` | `string` | JSON Web Algorithm identifier to be used with the imported key. |
| `options?` | [`PEMImportOptions`](../interfaces/key_import.PEMImportOptions.md) | - |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>
