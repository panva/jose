# Interface: FlattenedDecryptResult

[types](../modules/types.md).FlattenedDecryptResult

## Hierarchy

- **`FlattenedDecryptResult`**

  ↳ [`GeneralDecryptResult`](types.GeneralDecryptResult.md)

## Table of contents

### Properties

- [additionalAuthenticatedData](types.FlattenedDecryptResult.md#additionalauthenticateddata)
- [plaintext](types.FlattenedDecryptResult.md#plaintext)
- [protectedHeader](types.FlattenedDecryptResult.md#protectedheader)
- [sharedUnprotectedHeader](types.FlattenedDecryptResult.md#sharedunprotectedheader)
- [unprotectedHeader](types.FlattenedDecryptResult.md#unprotectedheader)

## Properties

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: `Uint8Array`

JWE AAD.

#### Defined in

[types.d.ts:605](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L605)

___

### plaintext

• **plaintext**: `Uint8Array`

Plaintext.

#### Defined in

[types.d.ts:610](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L610)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Protected Header.

#### Defined in

[types.d.ts:615](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L615)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Shared Unprotected Header.

#### Defined in

[types.d.ts:620](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L620)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header.

#### Defined in

[types.d.ts:625](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L625)
