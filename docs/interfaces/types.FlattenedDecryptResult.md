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

[types.d.ts:633](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L633)

___

### plaintext

• **plaintext**: `Uint8Array`

Plaintext.

#### Defined in

[types.d.ts:638](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L638)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Protected Header.

#### Defined in

[types.d.ts:643](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L643)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Shared Unprotected Header.

#### Defined in

[types.d.ts:648](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L648)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header.

#### Defined in

[types.d.ts:653](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L653)
