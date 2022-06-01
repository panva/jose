# Interface: FlattenedDecryptResult

[💗 Help the project](https://github.com/sponsors/panva)

## Table of contents

### Properties

- [plaintext](types.FlattenedDecryptResult.md#plaintext)
- [additionalAuthenticatedData](types.FlattenedDecryptResult.md#additionalauthenticateddata)
- [protectedHeader](types.FlattenedDecryptResult.md#protectedheader)
- [sharedUnprotectedHeader](types.FlattenedDecryptResult.md#sharedunprotectedheader)
- [unprotectedHeader](types.FlattenedDecryptResult.md#unprotectedheader)

## Properties

### plaintext

• **plaintext**: `Uint8Array`

Plaintext.

___

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: `Uint8Array`

JWE AAD.

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Protected Header.

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Shared Unprotected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header.
