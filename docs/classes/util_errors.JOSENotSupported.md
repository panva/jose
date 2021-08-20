# Class: JOSENotSupported

[util/errors](../modules/util_errors.md).JOSENotSupported

An error subclass thrown when a particular feature or algorithm is not supported by this
implementation or JOSE in general.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JOSENotSupported`**

## Table of contents

### Constructors

- [constructor](util_errors.JOSENotSupported.md#constructor)

### Properties

- [code](util_errors.JOSENotSupported.md#code)
- [code](util_errors.JOSENotSupported.md#code)

## Constructors

### constructor

• **new JOSENotSupported**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.15.2/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:66](https://github.com/panva/jose/blob/v3.15.2/src/util/errors.ts#L66)

___

### code

▪ `Static` **code**: `string` = `'ERR_JOSE_NOT_SUPPORTED'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:64](https://github.com/panva/jose/blob/v3.15.2/src/util/errors.ts#L64)
