# Class: JWTClaimValidationFailed

[💗 Help the project](https://github.com/sponsors/panva)

An error subclass thrown when a JWT Claim Set member validation fails.

## Implemented by

- [`JWTExpired`](util_errors.JWTExpired.md)

## Table of contents

### Constructors

- [constructor](util_errors.JWTClaimValidationFailed.md#constructor)

### Properties

- [claim](util_errors.JWTClaimValidationFailed.md#claim)
- [code](util_errors.JWTClaimValidationFailed.md#code)
- [reason](util_errors.JWTClaimValidationFailed.md#reason)

### Accessors

- [code](util_errors.JWTClaimValidationFailed.md#code-1)

## Constructors

### constructor

• **new JWTClaimValidationFailed**(`message`, `claim?`, `reason?`)

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

• **code**: `string` = `'ERR_JWT_CLAIM_VALIDATION_FAILED'`

A unique error code for the particular error subclass.

___

### reason

• **reason**: `string`

Reason code for the validation failure.

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWT_CLAIM_VALIDATION_FAILED"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWT_CLAIM_VALIDATION_FAILED"``
