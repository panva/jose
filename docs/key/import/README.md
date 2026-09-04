# key/import

Cryptographic key import functions

## Interfaces

| Interface | Description |
| ------ | ------ |
| [KeyImportOptions](interfaces/KeyImportOptions.md) | Key Import Function options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ImportedJWK](type-aliases/ImportedJWK.md) | Resolves what [importJWK](functions/importJWK.md) returns for a given JWK type. The "kty" (Key Type) Parameter fully determines the outcome at runtime: `"oct"` yields a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) secret, every other supported key type yields a [CryptoKey](../../types/type-aliases/CryptoKey.md). When "kty" is not statically known — the usual case for a JWK parsed from JSON, or for a value typed as [JWK](../../types/type-aliases/JWK.md) — this resolves to their union. |

## Functions

| Function | Description |
| ------ | ------ |
| [importJWK](functions/importJWK.md) | Imports a JWK to a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). Either the JWK "alg" (Algorithm) Parameter, or the optional "alg" argument, must be present for asymmetric JSON Web Key imports. |
| [importPKCS8](functions/importPKCS8.md) | Imports a PEM-encoded PKCS#8 string as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). |
| [importSPKI](functions/importSPKI.md) | Imports a PEM-encoded SPKI string as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). |
| [importX509](functions/importX509.md) | Imports the SPKI from an X.509 string certificate as a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey). |
