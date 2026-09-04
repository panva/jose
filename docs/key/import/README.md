# key/import

Cryptographic key import functions

## Interfaces

| Interface | Description |
| ------ | ------ |
| [KeyImportOptions](interfaces/KeyImportOptions.md) | Key import options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ImportedJWK](type-aliases/ImportedJWK.md) | Maps a JWK key type to the value returned by [importJWK](functions/importJWK.md). |

## Functions

| Function | Description |
| ------ | ------ |
| [importJWK](functions/importJWK.md) | Imports a JWK as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) or [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array). |
| [importPKCS8](functions/importPKCS8.md) | Imports a PEM-encoded PKCS#8 string as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). |
| [importSPKI](functions/importSPKI.md) | Imports a PEM-encoded SPKI string as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). |
| [importX509](functions/importX509.md) | Imports the SPKI from an X.509 string certificate as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). |
