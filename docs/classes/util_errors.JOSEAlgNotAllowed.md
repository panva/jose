# Class: JOSEAlgNotAllowed

[util/errors](../modules/util_errors.md).JOSEAlgNotAllowed

An error subclass thrown when a JOSE Algorithm is not allowed per developer preference.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JOSEAlgNotAllowed`**

## Table of contents

### Constructors

- [constructor](util_errors.JOSEAlgNotAllowed.md#constructor)

### Properties

- [code](util_errors.JOSEAlgNotAllowed.md#code)
- [code](util_errors.JOSEAlgNotAllowed.md#code)

## Constructors

### constructor

• **new JOSEAlgNotAllowed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:18](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L18)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:58](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L58)

___

### code

▪ `Static` **code**: `string` = `'ERR_JOSE_ALG_NOT_ALLOWED'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:56](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L56)
