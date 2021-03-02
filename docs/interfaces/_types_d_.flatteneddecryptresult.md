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

*Defined in [src/types.d.ts:538](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L538)*

JWE AAD.

___

### plaintext

•  **plaintext**: Uint8Array

*Defined in [src/types.d.ts:543](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L543)*

Plaintext.

___

### protectedHeader

• `Optional` **protectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:548](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L548)*

JWE Protected Header.

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:553](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L553)*

JWE Shared Unprotected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:558](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L558)*

JWE Per-Recipient Unprotected Header.
