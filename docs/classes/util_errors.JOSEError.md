# Class: JOSEError

[util/errors](../modules/util_errors.md).JOSEError

A generic Error subclass that all other specific
JOSE Error subclasses inherit from.

## Table of contents

### Constructors

- [constructor](util_errors.JOSEError.md#constructor)

### Properties

- [code](util_errors.JOSEError.md#code)

### Accessors

- [code](util_errors.JOSEError.md#code)

## Constructors

### constructor

• **new JOSEError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

## Properties

### code

• **code**: `string` = `'ERR_JOSE_GENERIC'`

A unique error code for the particular error subclass.

## Accessors

### code

• `Static` `get` **code**(): `string`

A unique error code for the particular error subclass.

#### Returns

`string`
