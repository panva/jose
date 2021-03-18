# Class: JWKSNoMatchingKey

[util/errors](../modules/util_errors.md).JWKSNoMatchingKey

An error subclass thrown when no keys match from a JWKS.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWKSNoMatchingKey**

## Table of contents

### Constructors

- [constructor](util_errors.jwksnomatchingkey.md#constructor)

### Properties

- [code](util_errors.jwksnomatchingkey.md#code)
- [message](util_errors.jwksnomatchingkey.md#message)

## Constructors

### constructor

\+ **new JWKSNoMatchingKey**(`message?`: *string*): [*JWKSNoMatchingKey*](util_errors.jwksnomatchingkey.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWKSNoMatchingKey*](util_errors.jwksnomatchingkey.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L11)

## Properties

### code

• **code**: *string*= 'ERR\_JWKS\_NO\_MATCHING\_KEY'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:108](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L108)

___

### message

• **message**: *string*= 'no applicable key found in the JSON Web Key Set'

Overrides: void

Defined in: [util/errors.ts:110](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L110)
