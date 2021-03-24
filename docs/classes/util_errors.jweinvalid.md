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

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L16)

## Properties

### code

• **code**: *string*

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:88](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L88)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JWE\_INVALID'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:86](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L86)
