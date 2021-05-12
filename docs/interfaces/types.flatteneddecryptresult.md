# Interface: FlattenedDecryptResult

[types](../modules/types.md).FlattenedDecryptResult

## Hierarchy

- **FlattenedDecryptResult**

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

Defined in: [types.d.ts:598](https://github.com/panva/jose/blob/v3.12.0/src/types.d.ts#L598)

___

### plaintext

• **plaintext**: *Uint8Array*

Plaintext.

Defined in: [types.d.ts:603](https://github.com/panva/jose/blob/v3.12.0/src/types.d.ts#L603)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Protected Header.

Defined in: [types.d.ts:608](https://github.com/panva/jose/blob/v3.12.0/src/types.d.ts#L608)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Shared Unprotected Header.

Defined in: [types.d.ts:613](https://github.com/panva/jose/blob/v3.12.0/src/types.d.ts#L613)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Per-Recipient Unprotected Header.

Defined in: [types.d.ts:618](https://github.com/panva/jose/blob/v3.12.0/src/types.d.ts#L618)
