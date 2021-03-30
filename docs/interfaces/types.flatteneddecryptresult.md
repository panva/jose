# Interface: FlattenedDecryptResult

[types](../modules/types.md).FlattenedDecryptResult

## Hierarchy

* **FlattenedDecryptResult**

  ↳ [*GeneralDecryptResult*](types.generaldecryptresult.md)

## Table of contents

### Properties

- [additionalAuthenticatedData](types.flatteneddecryptresult.md#additionalauthenticateddata)
- [plaintext](types.flatteneddecryptresult.md#plaintext)
- [protectedHeader](types.flatteneddecryptresult.md#protectedheader)
- [sharedUnprotectedHeader](types.flatteneddecryptresult.md#sharedunprotectedheader)
- [unprotectedHeader](types.flatteneddecryptresult.md#unprotectedheader)

## Properties

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: *Uint8Array*

JWE AAD.

Defined in: [types.d.ts:544](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L544)

___

### plaintext

• **plaintext**: *Uint8Array*

Plaintext.

Defined in: [types.d.ts:549](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L549)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Protected Header.

Defined in: [types.d.ts:554](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L554)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Shared Unprotected Header.

Defined in: [types.d.ts:559](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L559)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Per-Recipient Unprotected Header.

Defined in: [types.d.ts:564](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L564)
