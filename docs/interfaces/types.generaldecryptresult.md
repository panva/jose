# Interface: GeneralDecryptResult

[types](../modules/types.md).GeneralDecryptResult

## Hierarchy

* [*FlattenedDecryptResult*](types.flatteneddecryptresult.md)

  ↳ **GeneralDecryptResult**

## Table of contents

### Properties

- [additionalAuthenticatedData](types.generaldecryptresult.md#additionalauthenticateddata)
- [plaintext](types.generaldecryptresult.md#plaintext)
- [protectedHeader](types.generaldecryptresult.md#protectedheader)
- [sharedUnprotectedHeader](types.generaldecryptresult.md#sharedunprotectedheader)
- [unprotectedHeader](types.generaldecryptresult.md#unprotectedheader)

## Properties

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: *Uint8Array*

JWE AAD.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[additionalAuthenticatedData](types.flatteneddecryptresult.md#additionalauthenticateddata)

Defined in: [types.d.ts:591](https://github.com/panva/jose/blob/main/src/types.d.ts#L591)

___

### plaintext

• **plaintext**: *Uint8Array*

Plaintext.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[plaintext](types.flatteneddecryptresult.md#plaintext)

Defined in: [types.d.ts:596](https://github.com/panva/jose/blob/main/src/types.d.ts#L596)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Protected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[protectedHeader](types.flatteneddecryptresult.md#protectedheader)

Defined in: [types.d.ts:601](https://github.com/panva/jose/blob/main/src/types.d.ts#L601)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Shared Unprotected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[sharedUnprotectedHeader](types.flatteneddecryptresult.md#sharedunprotectedheader)

Defined in: [types.d.ts:606](https://github.com/panva/jose/blob/main/src/types.d.ts#L606)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Per-Recipient Unprotected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[unprotectedHeader](types.flatteneddecryptresult.md#unprotectedheader)

Defined in: [types.d.ts:611](https://github.com/panva/jose/blob/main/src/types.d.ts#L611)
