# Class: JWSInvalid

[util/errors](../modules/util_errors.md).JWSInvalid

An error subclass thrown when a JWS is invalid.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWSInvalid**

## Table of contents

### Constructors

- [constructor](util_errors.jwsinvalid.md#constructor)

### Properties

- [code](util_errors.jwsinvalid.md#code)
- [code](util_errors.jwsinvalid.md#code)

## Constructors

### constructor

\+ **new JWSInvalid**(`message?`: *string*): [*JWSInvalid*](util_errors.jwsinvalid.md)

#### Parameters:

| Name | Type |
| :------ | :------ |
| `message?` | *string* |

**Returns:** [*JWSInvalid*](util_errors.jwsinvalid.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/v3.11.6/src/util/errors.ts#L16)

## Properties

### code

• **code**: *string*

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:97](https://github.com/panva/jose/blob/v3.11.6/src/util/errors.ts#L97)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JWS\_INVALID'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:95](https://github.com/panva/jose/blob/v3.11.6/src/util/errors.ts#L95)
