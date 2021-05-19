# Interface: GeneralDecryptResult

[types](../modules/types.md).GeneralDecryptResult

## Hierarchy

- [*FlattenedDecryptResult*](types.flatteneddecryptresult.md)

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

Defined in: [types.d.ts:598](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L598)

___

### plaintext

• **plaintext**: *Uint8Array*

Plaintext.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[plaintext](types.flatteneddecryptresult.md#plaintext)

Defined in: [types.d.ts:603](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L603)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Protected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[protectedHeader](types.flatteneddecryptresult.md#protectedheader)

Defined in: [types.d.ts:608](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L608)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Shared Unprotected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[sharedUnprotectedHeader](types.flatteneddecryptresult.md#sharedunprotectedheader)

Defined in: [types.d.ts:613](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L613)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Per-Recipient Unprotected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[unprotectedHeader](types.flatteneddecryptresult.md#unprotectedheader)

Defined in: [types.d.ts:618](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L618)
