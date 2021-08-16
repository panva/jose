# Class: JWEInvalid

[util/errors](../modules/util_errors.md).JWEInvalid

An error subclass thrown when a JWE is invalid.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWEInvalid`**

## Table of contents

### Constructors

- [constructor](util_errors.JWEInvalid.md#constructor)

### Properties

- [code](util_errors.JWEInvalid.md#code)
- [code](util_errors.JWEInvalid.md#code)

## Constructors

### constructor

• **new JWEInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:18](https://github.com/panva/jose/blob/v3.14.4/src/util/errors.ts#L18)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:88](https://github.com/panva/jose/blob/v3.14.4/src/util/errors.ts#L88)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWE_INVALID'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:86](https://github.com/panva/jose/blob/v3.14.4/src/util/errors.ts#L86)
