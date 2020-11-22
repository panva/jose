# Class: JWTExpired

An error subclass thrown when a JWT is expired.

## Index

### Constructors

* [constructor](_util_errors_.jwtexpired.md#constructor)

### Properties

* [claim](_util_errors_.jwtexpired.md#claim)
* [code](_util_errors_.jwtexpired.md#code)
* [message](_util_errors_.jwtexpired.md#message)
* [name](_util_errors_.jwtexpired.md#name)
* [reason](_util_errors_.jwtexpired.md#reason)
* [stack](_util_errors_.jwtexpired.md#stack)

## Constructors

### constructor

\+ **new JWTExpired**(`message`: string, `claim?`: string, `reason?`: string): [JWTExpired](_util_errors_.jwtexpired.md)

*Overrides [JOSEError](_util_errors_.joseerror.md).[constructor](_util_errors_.joseerror.md#constructor)*

*Defined in [src/util/errors.ts:36](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L36)*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`message` | string | - |
`claim` | string | "unspecified" |
`reason` | string | "unspecified" |

**Returns:** [JWTExpired](_util_errors_.jwtexpired.md)

## Properties

### claim

•  **claim**: string

*Defined in [src/util/errors.ts:31](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L31)*

The Claim for which the validation failed.

___

### code

•  **code**: string = "ERR\_JWT\_EXPIRED"

*Overrides [JWTClaimValidationFailed](_util_errors_.jwtclaimvalidationfailed.md).[code](_util_errors_.jwtclaimvalidationfailed.md#code)*

*Defined in [src/util/errors.ts:135](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L135)*

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
