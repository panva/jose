# Class: JWSSignatureVerificationFailed

[util/errors](../modules/util_errors.md).JWSSignatureVerificationFailed

An error subclass thrown when JWS signature verification fails.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWSSignatureVerificationFailed**

## Table of contents

### Constructors

- [constructor](util_errors.jwssignatureverificationfailed.md#constructor)

### Properties

- [code](util_errors.jwssignatureverificationfailed.md#code)
- [message](util_errors.jwssignatureverificationfailed.md#message)

## Constructors

### constructor

\+ **new JWSSignatureVerificationFailed**(`message?`: *string*): [*JWSSignatureVerificationFailed*](util_errors.jwssignatureverificationfailed.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWSSignatureVerificationFailed*](util_errors.jwssignatureverificationfailed.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L11)

## Properties

### code

• **code**: *string*= 'ERR\_JWS\_SIGNATURE\_VERIFICATION\_FAILED'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:126](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L126)

___

### message

• **message**: *string*= 'signature verification failed'

Overrides: void

Defined in: [util/errors.ts:128](https://github.com/panva/jose/blob/v3.10.0/src/util/errors.ts#L128)
