# jws/general/verify

Verifying JSON Web Signature (JWS) in General JSON Serialization

## See

[RFC 7515, Section 7.2.1](https://www.rfc-editor.org/info/rfc7515/#section-7.2.1)

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GeneralVerifyGetKey](interfaces/GeneralVerifyGetKey.md) | Resolves a key for General JWS verification from unverified headers and token data. |

## Functions

| Function | Description |
| ------ | ------ |
| [generalVerify](functions/generalVerify.md) | Validates a JWS Signature (digital signature or MAC) from a general JWS JSON Serialization and decodes its JWS Payload. |
