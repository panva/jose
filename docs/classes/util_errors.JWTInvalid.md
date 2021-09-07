# Class: JWTInvalid

[util/errors](../modules/util_errors.md).JWTInvalid

An error subclass thrown when a JWT is invalid.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWTInvalid`**

## Table of contents

### Constructors

- [constructor](util_errors.JWTInvalid.md#constructor)

### Properties

- [code](util_errors.JWTInvalid.md#code)
- [code](util_errors.JWTInvalid.md#code)

## Constructors

### constructor

• **new JWTInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.16.0/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:104](https://github.com/panva/jose/blob/v3.16.0/src/util/errors.ts#L104)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWT_INVALID'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:102](https://github.com/panva/jose/blob/v3.16.0/src/util/errors.ts#L102)
