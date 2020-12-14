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

*Defined in [src/types.d.ts:500](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L500)*

JWE AAD.

___

### plaintext

•  **plaintext**: Uint8Array

*Defined in [src/types.d.ts:505](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L505)*

Plaintext.

___

### protectedHeader

• `Optional` **protectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:510](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L510)*

JWE Protected Header.

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:515](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L515)*

JWE Shared Unprotected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:520](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L520)*

JWE Per-Recipient Unprotected Header.
