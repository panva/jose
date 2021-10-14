# Class: JWKSTimeout

Timeout was reached when retrieving the JWKS response.

## Table of contents

### Constructors

- [constructor](util_errors.JWKSTimeout.md#constructor)

### Properties

- [code](util_errors.JWKSTimeout.md#code)
- [message](util_errors.JWKSTimeout.md#message)

### Accessors

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

• **code**: `string` = `'ERR_JWKS_TIMEOUT'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'request timed out'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWKS_TIMEOUT"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWKS_TIMEOUT"``
