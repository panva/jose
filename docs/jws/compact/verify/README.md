# jws/compact/verify

Verifying JSON Web Signature (JWS) in Compact Serialization

## See

[RFC 7515, Section 7.1](https://www.rfc-editor.org/info/rfc7515/#section-7.1)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CompactVerifyGetKey](interfaces/CompactVerifyGetKey.md) | Resolves a key for Compact JWS verification from unverified headers and token data. |

## Functions

| Function | Description |
| ------ | ------ |
| [compactVerify](functions/compactVerify.md) | Validates a JWS Compact Serialization (digital signature or MAC) and decodes its JWS Payload. |
