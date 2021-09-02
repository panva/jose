# Class: JWEDecryptionFailed

[util/errors](../modules/util_errors.md).JWEDecryptionFailed

An error subclass thrown when a JWE ciphertext decryption fails.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWEDecryptionFailed`**

## Table of contents

### Constructors

- [constructor](util_errors.JWEDecryptionFailed.md#constructor)

### Properties

- [code](util_errors.JWEDecryptionFailed.md#code)
- [message](util_errors.JWEDecryptionFailed.md#message)
- [code](util_errors.JWEDecryptionFailed.md#code)

## Constructors

### constructor

• **new JWEDecryptionFailed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.15.5/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:75](https://github.com/panva/jose/blob/v3.15.5/src/util/errors.ts#L75)

___

### message

• **message**: `string` = `'decryption operation failed'`

#### Overrides

JOSEError.message

#### Defined in

[util/errors.ts:77](https://github.com/panva/jose/blob/v3.15.5/src/util/errors.ts#L77)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWE_DECRYPTION_FAILED'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:73](https://github.com/panva/jose/blob/v3.15.5/src/util/errors.ts#L73)
