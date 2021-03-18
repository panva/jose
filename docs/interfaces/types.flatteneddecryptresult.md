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

Defined in: [types.d.ts:538](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L538)

___

### plaintext

• **plaintext**: *Uint8Array*

Plaintext.

Defined in: [types.d.ts:543](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L543)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Protected Header.

Defined in: [types.d.ts:548](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L548)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Shared Unprotected Header.

Defined in: [types.d.ts:553](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L553)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

JWE Per-Recipient Unprotected Header.

Defined in: [types.d.ts:558](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L558)
