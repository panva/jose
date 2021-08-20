# Class: JWKSInvalid

[util/errors](../modules/util_errors.md).JWKSInvalid

An error subclass thrown when a JWKS is invalid.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWKSInvalid`**

## Table of contents

### Constructors

- [constructor](util_errors.JWKSInvalid.md#constructor)

### Properties

- [code](util_errors.JWKSInvalid.md#code)
- [code](util_errors.JWKSInvalid.md#code)

## Constructors

### constructor

• **new JWKSInvalid**(`message?`)

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

[util/errors.ts:122](https://github.com/panva/jose/blob/v3.15.0/src/util/errors.ts#L122)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWKS_INVALID'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:120](https://github.com/panva/jose/blob/v3.15.0/src/util/errors.ts#L120)
