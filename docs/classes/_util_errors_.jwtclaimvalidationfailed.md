# Class: JWTClaimValidationFailed

An error subclass thrown when a JWT Claim Set member validation fails.

## Index

### Constructors

* [constructor](_util_errors_.jwtclaimvalidationfailed.md#constructor)

### Properties

* [claim](_util_errors_.jwtclaimvalidationfailed.md#claim)
* [code](_util_errors_.jwtclaimvalidationfailed.md#code)
* [message](_util_errors_.jwtclaimvalidationfailed.md#message)
* [name](_util_errors_.jwtclaimvalidationfailed.md#name)
* [reason](_util_errors_.jwtclaimvalidationfailed.md#reason)
* [stack](_util_errors_.jwtclaimvalidationfailed.md#stack)

## Constructors

### constructor

\+ **new JWTClaimValidationFailed**(`message`: string, `claim?`: string, `reason?`: string): [JWTClaimValidationFailed](_util_errors_.jwtclaimvalidationfailed.md)

*Overrides [JOSEError](_util_errors_.joseerror.md).[constructor](_util_errors_.joseerror.md#constructor)*

*Defined in [src/util/errors.ts:36](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L36)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`message` | string | - |
`claim` | string | "unspecified" |
`reason` | string | "unspecified" |

**Returns:** [JWTClaimValidationFailed](_util_errors_.jwtclaimvalidationfailed.md)

## Properties

### claim

•  **claim**: string

*Defined in [src/util/errors.ts:31](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L31)*

The Claim for which the validation failed.

___

### code

•  **code**: string = "ERR\_JWT\_CLAIM\_VALIDATION\_FAILED"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:26](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L26)*

___

### message

•  **message**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:974*

___

### name

•  **name**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### reason

•  **reason**: string

*Defined in [src/util/errors.ts:36](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L36)*

Reason code for the validation failure.

___

### stack

• `Optional` **stack**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*
