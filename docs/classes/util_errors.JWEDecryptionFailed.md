# Class: JWEDecryptionFailed

[💗 Help the project](https://github.com/sponsors/panva)

An error subclass thrown when a JWE ciphertext decryption fails.

## Table of contents

### Constructors

- [constructor](util_errors.JWEDecryptionFailed.md#constructor)

### Properties

- [code](util_errors.JWEDecryptionFailed.md#code)
- [message](util_errors.JWEDecryptionFailed.md#message)

### Accessors

- [code](util_errors.JWEDecryptionFailed.md#code-1)

## Constructors

### constructor

• **new JWEDecryptionFailed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JWE_DECRYPTION_FAILED'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'decryption operation failed'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWE_DECRYPTION_FAILED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWE_DECRYPTION_FAILED"``
