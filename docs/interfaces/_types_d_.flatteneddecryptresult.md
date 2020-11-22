# Interface: FlattenedDecryptResult

## Index

### Properties

* [additionalAuthenticatedData](_types_d_.flatteneddecryptresult.md#additionalauthenticateddata)
* [plaintext](_types_d_.flatteneddecryptresult.md#plaintext)
* [protectedHeader](_types_d_.flatteneddecryptresult.md#protectedheader)
* [sharedUnprotectedHeader](_types_d_.flatteneddecryptresult.md#sharedunprotectedheader)
* [unprotectedHeader](_types_d_.flatteneddecryptresult.md#unprotectedheader)

## Properties

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: Uint8Array

*Defined in [src/types.d.ts:464](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L464)*

JWE AAD.

___

### plaintext

•  **plaintext**: Uint8Array

*Defined in [src/types.d.ts:469](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L469)*

Plaintext.

___

### protectedHeader

• `Optional` **protectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:474](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L474)*

JWE Protected Header.

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:479](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L479)*

JWE Shared Unprotected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:484](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L484)*

JWE Per-Recipient Unprotected Header.
