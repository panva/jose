# key/export

Cryptographic key export functions

## See

 - [RFC 7468, Section 10: PKCS #8](https://www.rfc-editor.org/info/rfc7468/#section-10)
 - [RFC 7468, Section 13: SubjectPublicKeyInfo](https://www.rfc-editor.org/info/rfc7468/#section-13)

## Functions

| Function | Description |
| ------ | ------ |
| [exportJWK](functions/exportJWK.md) | Exports a key to JWK. CryptoKey inputs must be extractable. |
| [exportPKCS8](functions/exportPKCS8.md) | Exports a private key to PEM-encoded PKCS #8. CryptoKey inputs must be extractable. |
| [exportSPKI](functions/exportSPKI.md) | Exports a public key to PEM-encoded SPKI. CryptoKey inputs must be extractable. |
