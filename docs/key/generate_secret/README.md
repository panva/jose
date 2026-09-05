# key/generate\_secret

Symmetric key generation

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GenerateSecretOptions](interfaces/GenerateSecretOptions.md) | Secret generation options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [GeneratedSecret](type-aliases/GeneratedSecret.md) | Maps a JWA algorithm identifier to the value returned by [generateSecret](functions/generateSecret.md). AES-CBC-HMAC algorithms return [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array); other supported algorithms return [CryptoKey](../../types/type-aliases/CryptoKey.md). When the algorithm is not statically known, the result is their union. |

## Functions

| Function | Description |
| ------ | ------ |
| [generateSecret](functions/generateSecret.md) | Generates a symmetric secret key for a given JWA algorithm identifier. |
