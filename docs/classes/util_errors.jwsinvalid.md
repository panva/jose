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

## Constructors

### constructor

\+ **new JWSInvalid**(`message?`: *string*): [*JWSInvalid*](util_errors.jwsinvalid.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWSInvalid*](util_errors.jwsinvalid.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.9.0/src/util/errors.ts#L11)

## Properties

### code

• **code**: *string*= 'ERR\_JWS\_INVALID'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:80](https://github.com/panva/jose/blob/v3.9.0/src/util/errors.ts#L80)
