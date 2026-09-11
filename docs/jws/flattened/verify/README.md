# jws/flattened/verify

Verifying JSON Web Signature (JWS) in Flattened JSON Serialization

## See

[RFC 7515, Section 7.2.2](https://www.rfc-editor.org/info/rfc7515/#section-7.2.2)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [FlattenedVerifyGetKey](interfaces/FlattenedVerifyGetKey.md) | Resolves a key for Flattened JWS verification from unverified headers and token data. |

## Functions

| Function | Description |
| ------ | ------ |
| [flattenedVerify](functions/flattenedVerify.md) | Validates a flattened JWS JSON Serialization (digital signature or MAC) and decodes its JWS Payload. |
