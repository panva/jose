# Class: JWTInvalid

[util/errors](../modules/util_errors.md).JWTInvalid

An error subclass thrown when a JWT is invalid.

## Hierarchy

- [JOSEError](util_errors.joseerror.md)

  ↳ **JWTInvalid**

## Table of contents

### Constructors

- [constructor](util_errors.jwtinvalid.md#constructor)

### Properties

- [code](util_errors.jwtinvalid.md#code)
- [code](util_errors.jwtinvalid.md#code)

## Constructors

### constructor

• **new JWTInvalid**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.joseerror.md).[constructor](util_errors.joseerror.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

#### Defined in

[util/errors.ts:106](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L106)

___

### code

▪ `Static` **code**: `string` = 'ERR\_JWT\_INVALID'

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

#### Defined in

[util/errors.ts:104](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L104)
