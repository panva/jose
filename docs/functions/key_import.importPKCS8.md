# Function: importPKCS8

[💗 Help the project](https://github.com/sponsors/panva)

▸ **importPKCS8**(`pkcs8`, `alg`, `options?`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Imports a PEM-encoded PKCS#8 string as a runtime-specific private key representation (KeyObject
or CryptoKey). See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210) to
learn about key to algorithm requirements and mapping. Encrypted keys are not supported.

**`example`** Usage

```js
const algorithm = 'ES256'
const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
-----END PRIVATE KEY-----`
const ecPrivateKey = await jose.importPKCS8(pkcs8, algorithm)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pkcs8` | `string` | - |
| `alg` | `string` | JSON Web Algorithm identifier to be used with the imported key. |
| `options?` | [`PEMImportOptions`](../interfaces/key_import.PEMImportOptions.md) | - |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>
