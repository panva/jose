# Class: JWKSNoMatchingKey

[util/errors](../modules/util_errors.md).JWKSNoMatchingKey

An error subclass thrown when no keys match from a JWKS.

## Table of contents

### Constructors

- [constructor](util_errors.JWKSNoMatchingKey.md#constructor)

### Properties

- [code](util_errors.JWKSNoMatchingKey.md#code)
- [message](util_errors.JWKSNoMatchingKey.md#message)
- [code](util_errors.JWKSNoMatchingKey.md#code)

## Constructors

### constructor

• **new JWKSNoMatchingKey**(`message?`)

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

• **message**: `string` = `'no applicable key found in the JSON Web Key Set'`

___

### code

▪ `Static` **code**: `string` = `'ERR_JWKS_NO_MATCHING_KEY'`

A unique error code for the particular error subclass.
