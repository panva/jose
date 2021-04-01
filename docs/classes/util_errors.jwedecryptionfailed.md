# Class: JWEDecryptionFailed

[util/errors](../modules/util_errors.md).JWEDecryptionFailed

An error subclass thrown when a JWE ciphertext decryption fails.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWEDecryptionFailed**

## Table of contents

### Constructors

- [constructor](util_errors.jwedecryptionfailed.md#constructor)

### Properties

- [code](util_errors.jwedecryptionfailed.md#code)
- [message](util_errors.jwedecryptionfailed.md#message)
- [code](util_errors.jwedecryptionfailed.md#code)

## Constructors

### constructor

\+ **new JWEDecryptionFailed**(`message?`: *string*): [*JWEDecryptionFailed*](util_errors.jwedecryptionfailed.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWEDecryptionFailed*](util_errors.jwedecryptionfailed.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/v3.11.3/src/util/errors.ts#L16)

## Properties

### code

• **code**: *string*

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:77](https://github.com/panva/jose/blob/v3.11.3/src/util/errors.ts#L77)

___

### message

• **message**: *string*= 'decryption operation failed'

Overrides: void

Defined in: [util/errors.ts:79](https://github.com/panva/jose/blob/v3.11.3/src/util/errors.ts#L79)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JWE\_DECRYPTION\_FAILED'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:75](https://github.com/panva/jose/blob/v3.11.3/src/util/errors.ts#L75)
