# Class: JWKSTimeout

[util/errors](../modules/util_errors.md).JWKSTimeout

Timeout was reached when retrieving the JWKS response.

## Table of contents

### Constructors

- [constructor](util_errors.JWKSTimeout.md#constructor)

### Properties

- [code](util_errors.JWKSTimeout.md#code)
- [message](util_errors.JWKSTimeout.md#message)
- [code](util_errors.JWKSTimeout.md#code)

## Constructors

### constructor

• **new JWKSTimeout**(`message?`)

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

• **message**: `string` = `'request timed out'`

___

### code

▪ `Static` **code**: `string` = `'ERR_JWKS_TIMEOUT'`

A unique error code for the particular error subclass.
