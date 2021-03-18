# Class: JWKInvalid

[util/errors](../modules/util_errors.md).JWKInvalid

An error subclass thrown when a JWK is invalid.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWKInvalid**

## Table of contents

### Constructors

- [constructor](util_errors.jwkinvalid.md#constructor)

### Properties

- [code](util_errors.jwkinvalid.md#code)

## Constructors

### constructor

\+ **new JWKInvalid**(`message?`: *string*): [*JWKInvalid*](util_errors.jwkinvalid.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWKInvalid*](util_errors.jwkinvalid.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L11)

## Properties

### code

• **code**: *string*= 'ERR\_JWK\_INVALID'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:94](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L94)
