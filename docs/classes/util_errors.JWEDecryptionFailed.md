# Class: JWEDecryptionFailed

[util/errors](../modules/util_errors.md).JWEDecryptionFailed

An error subclass thrown when a JWE ciphertext decryption fails.

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

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'decryption operation failed'`

___

### code

▪ `Static` **code**: `string` = `'ERR_JWE_DECRYPTION_FAILED'`

A unique error code for the particular error subclass.
