# Class: JWKInvalid

[util/errors](../modules/util_errors.md).JWKInvalid

An error subclass thrown when a JWK is invalid.

## Hierarchy

- [JOSEError](util_errors.joseerror.md)

  ↳ **JWKInvalid**

## Table of contents

### Constructors

- [constructor](util_errors.jwkinvalid.md#constructor)

### Properties

- [code](util_errors.jwkinvalid.md#code)
- [code](util_errors.jwkinvalid.md#code)

## Constructors

### constructor

• **new JWKInvalid**(`message?`)

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

[util/errors.ts:115](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L115)

___

### code

▪ `Static` **code**: `string` = 'ERR\_JWK\_INVALID'

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

#### Defined in

[util/errors.ts:113](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L113)
