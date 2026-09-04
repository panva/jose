# key/generate\_secret

Symmetric key generation

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GenerateSecretOptions](interfaces/GenerateSecretOptions.md) | Secret generation function options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [GeneratedSecret](type-aliases/GeneratedSecret.md) | Resolves what [generateSecret](functions/generateSecret.md) returns for a given JWA Algorithm Identifier. The AES_CBC_HMAC_SHA2 content encryption algorithms have no [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) representation, so they yield a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array); every other supported identifier yields a [CryptoKey](../../types/type-aliases/CryptoKey.md). When the identifier is not statically known this resolves to their union. |

## Functions

| Function | Description |
| ------ | ------ |
| [generateSecret](functions/generateSecret.md) | Generates a symmetric secret key for a given JWA algorithm identifier. |
