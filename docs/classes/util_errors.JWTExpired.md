# Class: JWTExpired

[util/errors](../modules/util_errors.md).JWTExpired

An error subclass thrown when a JWT is expired.

## Table of contents

### Constructors

- [constructor](util_errors.JWTExpired.md#constructor)

### Properties

- [claim](util_errors.JWTExpired.md#claim)
- [code](util_errors.JWTExpired.md#code)
- [reason](util_errors.JWTExpired.md#reason)

### Accessors

- [code](util_errors.JWTExpired.md#code)

## Constructors

### constructor

• **new JWTExpired**(`message`, `claim?`, `reason?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `undefined` |
| `claim` | `string` | `'unspecified'` |
| `reason` | `string` | `'unspecified'` |

## Properties

### claim

• **claim**: `string`

The Claim for which the validation failed.

___

### code

• **code**: `string` = `'ERR_JWT_EXPIRED'`

A unique error code for the particular error subclass.

___

### reason

• **reason**: `string`

Reason code for the validation failure.

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWT_EXPIRED"``

#### Returns

``"ERR_JWT_EXPIRED"``
