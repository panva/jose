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

*Defined in [src/types.d.ts:532](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L532)*

JWE AAD.

___

### plaintext

•  **plaintext**: Uint8Array

*Defined in [src/types.d.ts:537](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L537)*

Plaintext.

___

### protectedHeader

• `Optional` **protectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:542](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L542)*

JWE Protected Header.

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:547](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L547)*

JWE Shared Unprotected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:552](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L552)*

JWE Per-Recipient Unprotected Header.
