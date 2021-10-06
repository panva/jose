# Class: JWKSMultipleMatchingKeys

[util/errors](../modules/util_errors.md).JWKSMultipleMatchingKeys

An error subclass thrown when multiple keys match from a JWKS.

## Table of contents

### Constructors

- [constructor](util_errors.JWKSMultipleMatchingKeys.md#constructor)

### Properties

- [code](util_errors.JWKSMultipleMatchingKeys.md#code)
- [message](util_errors.JWKSMultipleMatchingKeys.md#message)
- [code](util_errors.JWKSMultipleMatchingKeys.md#code)

## Constructors

### constructor

• **new JWKSMultipleMatchingKeys**(`message?`)

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

• **message**: `string` = `'multiple matching keys found in the JSON Web Key Set'`

___

### code

▪ `Static` **code**: `string` = `'ERR_JWKS_MULTIPLE_MATCHING_KEYS'`

A unique error code for the particular error subclass.
