# Class: JOSENotSupported

[util/errors](../modules/util_errors.md).JOSENotSupported

An error subclass thrown when a particular feature or algorithm is not supported by this
implementation or JOSE in general.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JOSENotSupported**

## Table of contents

### Constructors

- [constructor](util_errors.josenotsupported.md#constructor)

### Properties

- [code](util_errors.josenotsupported.md#code)

## Constructors

### constructor

\+ **new JOSENotSupported**(`message?`: *string*): [*JOSENotSupported*](util_errors.josenotsupported.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JOSENotSupported*](util_errors.josenotsupported.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L11)

## Properties

### code

• **code**: *string*= 'ERR\_JOSE\_NOT\_SUPPORTED'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:57](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L57)
