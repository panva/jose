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

Defined in: [types.d.ts:594](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L594)

___

### plaintext

• **plaintext**: *Uint8Array*

Plaintext.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[plaintext](types.flatteneddecryptresult.md#plaintext)

Defined in: [types.d.ts:599](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L599)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Protected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[protectedHeader](types.flatteneddecryptresult.md#protectedheader)

Defined in: [types.d.ts:604](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L604)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Shared Unprotected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[sharedUnprotectedHeader](types.flatteneddecryptresult.md#sharedunprotectedheader)

Defined in: [types.d.ts:609](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L609)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Per-Recipient Unprotected Header.

Inherited from: [FlattenedDecryptResult](types.flatteneddecryptresult.md).[unprotectedHeader](types.flatteneddecryptresult.md#unprotectedheader)

Defined in: [types.d.ts:614](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L614)
