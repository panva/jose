# Class: JWEInvalid

[util/errors](../modules/util_errors.md).JWEInvalid

An error subclass thrown when a JWE is invalid.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWEInvalid**

## Table of contents

### Constructors

- [constructor](util_errors.jweinvalid.md#constructor)

### Properties

- [code](util_errors.jweinvalid.md#code)

## Constructors

### constructor

\+ **new JWEInvalid**(`message?`: *string*): [*JWEInvalid*](util_errors.jweinvalid.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWEInvalid*](util_errors.jweinvalid.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L11)

## Properties

### code

• **code**: *string*= 'ERR\_JWE\_INVALID'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:73](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L73)
