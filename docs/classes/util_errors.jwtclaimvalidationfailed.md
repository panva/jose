# Class: JWTClaimValidationFailed

[util/errors](../modules/util_errors.md).JWTClaimValidationFailed

An error subclass thrown when a JWT Claim Set member validation fails.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWTClaimValidationFailed**

  ↳↳ [*JWTExpired*](util_errors.jwtexpired.md)

## Table of contents

### Constructors

- [constructor](util_errors.jwtclaimvalidationfailed.md#constructor)

### Properties

- [claim](util_errors.jwtclaimvalidationfailed.md#claim)
- [code](util_errors.jwtclaimvalidationfailed.md#code)
- [reason](util_errors.jwtclaimvalidationfailed.md#reason)
- [code](util_errors.jwtclaimvalidationfailed.md#code)

## Constructors

### constructor

\+ **new JWTClaimValidationFailed**(`message`: *string*, `claim?`: *string*, `reason?`: *string*): [*JWTClaimValidationFailed*](util_errors.jwtclaimvalidationfailed.md)

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`message` | *string* | - |
`claim` | *string* | 'unspecified' |
`reason` | *string* | 'unspecified' |

**Returns:** [*JWTClaimValidationFailed*](util_errors.jwtclaimvalidationfailed.md)

Overrides: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:43](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L43)

## Properties

### claim

• **claim**: *string*

The Claim for which the validation failed.

Defined in: [util/errors.ts:38](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L38)

___

### code

• **code**: *string*

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:33](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L33)

___

### reason

• **reason**: *string*

Reason code for the validation failure.

Defined in: [util/errors.ts:43](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L43)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JWT\_CLAIM\_VALIDATION\_FAILED'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:31](https://github.com/panva/jose/blob/v3.11.0/src/util/errors.ts#L31)
