# Class: JWKSMultipleMatchingKeys

[util/errors](../modules/util_errors.md).JWKSMultipleMatchingKeys

An error subclass thrown when multiple keys match from a JWKS.

## Hierarchy

- [`JOSEError`](util_errors.JOSEError.md)

  ↳ **`JWKSMultipleMatchingKeys`**

## Table of contents

### Constructors

- [constructor](util_errors.JWKSMultipleMatchingKeys.md#constructor)

### Properties

- [code](util_errors.JWKSMultipleMatchingKeys.md#code)
- [message](util_errors.JWKSMultipleMatchingKeys.md#message)
- [code](util_errors.JWKSMultipleMatchingKeys.md#code)

## Constructors

### constructor

• **new JWKSMultipleMatchingKeys**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.JOSEError.md).[constructor](util_errors.JOSEError.md#constructor)

#### Defined in

[util/errors.ts:18](https://github.com/panva/jose/blob/v3.14.1/src/util/errors.ts#L18)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:144](https://github.com/panva/jose/blob/v3.14.1/src/util/errors.ts#L144)

___

### message

• **message**: `string` = `'multiple matching keys found in the JSON Web Key Set'`

#### Overrides

JOSEError.message

#### Defined in

[util/errors.ts:146](https://github.com/panva/jose/blob/v3.14.1/src/util/errors.ts#L146)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWKS_MULTIPLE_MATCHING_KEYS'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.JOSEError.md).[code](util_errors.JOSEError.md#code)

#### Defined in

[util/errors.ts:142](https://github.com/panva/jose/blob/v3.14.1/src/util/errors.ts#L142)
