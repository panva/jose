# Interface: GeneralDecryptResult

[types](../modules/types.md).GeneralDecryptResult

## Table of contents

### Properties

- [additionalAuthenticatedData](types.GeneralDecryptResult.md#additionalauthenticateddata)
- [plaintext](types.GeneralDecryptResult.md#plaintext)
- [protectedHeader](types.GeneralDecryptResult.md#protectedheader)
- [sharedUnprotectedHeader](types.GeneralDecryptResult.md#sharedunprotectedheader)
- [unprotectedHeader](types.GeneralDecryptResult.md#unprotectedheader)

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
