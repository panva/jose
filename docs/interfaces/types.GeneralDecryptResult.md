# Interface: GeneralDecryptResult

[types](../modules/types.md).GeneralDecryptResult

## Hierarchy

- [`FlattenedDecryptResult`](types.FlattenedDecryptResult.md)

  ↳ **`GeneralDecryptResult`**

## Table of contents

### Properties

- [additionalAuthenticatedData](types.GeneralDecryptResult.md#additionalauthenticateddata)
- [plaintext](types.GeneralDecryptResult.md#plaintext)
- [protectedHeader](types.GeneralDecryptResult.md#protectedheader)
- [sharedUnprotectedHeader](types.GeneralDecryptResult.md#sharedunprotectedheader)
- [unprotectedHeader](types.GeneralDecryptResult.md#unprotectedheader)

## Properties

### additionalAuthenticatedData

• `Optional` **additionalAuthenticatedData**: `Uint8Array`

JWE AAD.

#### Inherited from

[FlattenedDecryptResult](types.FlattenedDecryptResult.md).[additionalAuthenticatedData](types.FlattenedDecryptResult.md#additionalauthenticateddata)

#### Defined in

[types.d.ts:633](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L633)

___

### plaintext

• **plaintext**: `Uint8Array`

Plaintext.

#### Inherited from

[FlattenedDecryptResult](types.FlattenedDecryptResult.md).[plaintext](types.FlattenedDecryptResult.md#plaintext)

#### Defined in

[types.d.ts:638](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L638)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Protected Header.

#### Inherited from

[FlattenedDecryptResult](types.FlattenedDecryptResult.md).[protectedHeader](types.FlattenedDecryptResult.md#protectedheader)

#### Defined in

[types.d.ts:643](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L643)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Shared Unprotected Header.

#### Inherited from

[FlattenedDecryptResult](types.FlattenedDecryptResult.md).[sharedUnprotectedHeader](types.FlattenedDecryptResult.md#sharedunprotectedheader)

#### Defined in

[types.d.ts:648](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L648)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header.

#### Inherited from

[FlattenedDecryptResult](types.FlattenedDecryptResult.md).[unprotectedHeader](types.FlattenedDecryptResult.md#unprotectedheader)

#### Defined in

[types.d.ts:653](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L653)
