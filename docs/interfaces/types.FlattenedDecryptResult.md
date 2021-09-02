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

[types.d.ts:604](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L604)

___

### plaintext

• **plaintext**: `Uint8Array`

Plaintext.

#### Defined in

[types.d.ts:609](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L609)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Protected Header.

#### Defined in

[types.d.ts:614](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L614)

___

### sharedUnprotectedHeader

• `Optional` **sharedUnprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Shared Unprotected Header.

#### Defined in

[types.d.ts:619](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L619)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header.

#### Defined in

[types.d.ts:624](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L624)
