# Class: JWKSNoMatchingKey

[util/errors](../modules/util_errors.md).JWKSNoMatchingKey

An error subclass thrown when no keys match from a JWKS.

## Hierarchy

- [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWKSNoMatchingKey**

## Table of contents

### Constructors

- [constructor](util_errors.jwksnomatchingkey.md#constructor)

### Properties

- [code](util_errors.jwksnomatchingkey.md#code)
- [message](util_errors.jwksnomatchingkey.md#message)
- [code](util_errors.jwksnomatchingkey.md#code)

## Constructors

### constructor

\+ **new JWKSNoMatchingKey**(`message?`: *string*): [*JWKSNoMatchingKey*](util_errors.jwksnomatchingkey.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | *string* |

**Returns:** [*JWKSNoMatchingKey*](util_errors.jwksnomatchingkey.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/v3.12.2/src/util/errors.ts#L16)

## Properties

### code

• **code**: *string*

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:133](https://github.com/panva/jose/blob/v3.12.2/src/util/errors.ts#L133)

___

### message

• **message**: *string*= 'no applicable key found in the JSON Web Key Set'

Overrides: JOSEError.message

Defined in: [util/errors.ts:135](https://github.com/panva/jose/blob/v3.12.2/src/util/errors.ts#L135)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JWKS\_NO\_MATCHING\_KEY'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:131](https://github.com/panva/jose/blob/v3.12.2/src/util/errors.ts#L131)
