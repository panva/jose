# Class: JWKSNoMatchingKey

An error subclass thrown when no keys match from a JWKS.

## Table of contents

### Constructors

- [constructor](util_errors.JWKSNoMatchingKey.md#constructor)

### Properties

- [code](util_errors.JWKSNoMatchingKey.md#code)
- [message](util_errors.JWKSNoMatchingKey.md#message)

### Accessors

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

• **code**: `string` = `'ERR_JWKS_NO_MATCHING_KEY'`

A unique error code for the particular error subclass.

___

### message

• **message**: `string` = `'no applicable key found in the JSON Web Key Set'`

## Accessors

### code

• `Static` `get` **code**(): ``"ERR_JWKS_NO_MATCHING_KEY"``

A unique error code for the particular error subclass.

#### Returns

``"ERR_JWKS_NO_MATCHING_KEY"``
