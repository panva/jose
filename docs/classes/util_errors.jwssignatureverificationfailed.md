# Class: JWSSignatureVerificationFailed

[util/errors](../modules/util_errors.md).JWSSignatureVerificationFailed

An error subclass thrown when JWS signature verification fails.

## Hierarchy

- [`JOSEError`](util_errors.joseerror.md)

  ↳ **`JWSSignatureVerificationFailed`**

## Table of contents

### Constructors

- [constructor](util_errors.jwssignatureverificationfailed.md#constructor)

### Properties

- [code](util_errors.jwssignatureverificationfailed.md#code)
- [message](util_errors.jwssignatureverificationfailed.md#message)
- [code](util_errors.jwssignatureverificationfailed.md#code)

## Constructors

### constructor

• **new JWSSignatureVerificationFailed**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[JOSEError](util_errors.joseerror.md).[constructor](util_errors.joseerror.md#constructor)

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.14.0/src/util/errors.ts#L16)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

#### Defined in

[util/errors.ts:155](https://github.com/panva/jose/blob/v3.14.0/src/util/errors.ts#L155)

___

### message

• **message**: `string` = `'signature verification failed'`

#### Overrides

JOSEError.message

#### Defined in

[util/errors.ts:157](https://github.com/panva/jose/blob/v3.14.0/src/util/errors.ts#L157)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'`

A unique error code for the particular error subclass.

#### Overrides

[JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

#### Defined in

[util/errors.ts:153](https://github.com/panva/jose/blob/v3.14.0/src/util/errors.ts#L153)
