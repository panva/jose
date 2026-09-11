# jwe/flattened/decrypt

Decrypting JSON Web Encryption (JWE) in Flattened JSON Serialization

## See

[RFC 7516, Section 7.2.2](https://www.rfc-editor.org/info/rfc7516/#section-7.2.2)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [FlattenedDecryptGetKey](interfaces/FlattenedDecryptGetKey.md) | Resolves a key for Flattened JWE decryption from unverified headers and token data. |

## Functions

| Function | Description |
| ------ | ------ |
| [flattenedDecrypt](functions/flattenedDecrypt.md) | Authenticates and decrypts a flattened JWE JSON Serialization. |
