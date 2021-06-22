# Class: JOSENotSupported

[util/errors](../modules/util_errors.md).JOSENotSupported

An error subclass thrown when a particular feature or algorithm is not supported by this
implementation or JOSE in general.

## Hierarchy

- [JOSEError](util_errors.joseerror.md)

  ↳ **JOSENotSupported**

## Table of contents

### Constructors

- [constructor](util_errors.josenotsupported.md#constructor)

### Properties

- [code](util_errors.josenotsupported.md#code)
- [code](util_errors.josenotsupported.md#code)

## Constructors

### constructor

• **new JOSENotSupported**(`message?`)

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

[util/errors.ts:68](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L68)

___

### code

▪ `Static` **code**: `string` = 'ERR\_JOSE\_NOT\_SUPPORTED'

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

#### Defined in

[util/errors.ts:66](https://github.com/panva/jose/blob/v3.13.0/src/util/errors.ts#L66)
