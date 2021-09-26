# Class: JWSInvalid

[util/errors](../modules/util_errors.md).JWSInvalid

An error subclass thrown when a JWS is invalid.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWSInvalid`**

## Table of contents

### Constructors

- [constructor](util_errors.JWSInvalid.md#constructor)

### Properties

- [code](util_errors.JWSInvalid.md#code)
- [code](util_errors.JWSInvalid.md#code)

## Constructors

### constructor

• **new JWSInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.19.0/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:95](https://github.com/panva/jose/blob/v3.19.0/src/util/errors.ts#L95)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWS_INVALID'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:93](https://github.com/panva/jose/blob/v3.19.0/src/util/errors.ts#L93)
