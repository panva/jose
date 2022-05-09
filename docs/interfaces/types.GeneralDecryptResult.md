# Interface: GeneralDecryptResult

## Table of contents

### Properties

- [plaintext](types.GeneralDecryptResult.md#plaintext)
- [additionalAuthenticatedData](types.GeneralDecryptResult.md#additionalauthenticateddata)
- [protectedHeader](types.GeneralDecryptResult.md#protectedheader)
- [sharedUnprotectedHeader](types.GeneralDecryptResult.md#sharedunprotectedheader)
- [unprotectedHeader](types.GeneralDecryptResult.md#unprotectedheader)

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
