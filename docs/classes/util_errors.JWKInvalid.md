# Class: JWKInvalid

[util/errors](../modules/util_errors.md).JWKInvalid

An error subclass thrown when a JWK is invalid.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWKInvalid`**

## Table of contents

### Constructors

- [constructor](util_errors.JWKInvalid.md#constructor)

### Properties

- [code](util_errors.JWKInvalid.md#code)
- [code](util_errors.JWKInvalid.md#code)

## Constructors

### constructor

• **new JWKInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.15.0/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:113](https://github.com/panva/jose/blob/v3.15.0/src/util/errors.ts#L113)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWK_INVALID'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:111](https://github.com/panva/jose/blob/v3.15.0/src/util/errors.ts#L111)
