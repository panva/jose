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

*Defined in [src/types.d.ts:498](https://github.com/panva/jose/blob/v3.3.1/src/types.d.ts#L498)*

JWE AAD.

___

### plaintext

•  **plaintext**: Uint8Array

*Defined in [src/types.d.ts:503](https://github.com/panva/jose/blob/v3.3.1/src/types.d.ts#L503)*

Plaintext.

___

### protectedHeader

• `Optional` **protectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:508](https://github.com/panva/jose/blob/v3.3.1/src/types.d.ts#L508)*

JWE Protected Header.

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:513](https://github.com/panva/jose/blob/v3.3.1/src/types.d.ts#L513)*

JWE Shared Unprotected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:518](https://github.com/panva/jose/blob/v3.3.1/src/types.d.ts#L518)*

JWE Per-Recipient Unprotected Header.
