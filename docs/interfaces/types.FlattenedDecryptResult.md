# Interface: FlattenedDecryptResult

## Table of contents

### Properties

- [additionalAuthenticatedData](types.FlattenedDecryptResult.md#additionalauthenticateddata)
- [plaintext](types.FlattenedDecryptResult.md#plaintext)
- [protectedHeader](types.FlattenedDecryptResult.md#protectedheader)
- [sharedUnprotectedHeader](types.FlattenedDecryptResult.md#sharedunprotectedheader)
- [unprotectedHeader](types.FlattenedDecryptResult.md#unprotectedheader)

## Properties

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: `Uint8Array`

JWE AAD.

___

### plaintext

• **plaintext**: `Uint8Array`

Plaintext.

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
