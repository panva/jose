# Class: JWSSignatureVerificationFailed

An error subclass thrown when JWS signature verification fails.

## Index

### Constructors

* [constructor](_util_errors_.jwssignatureverificationfailed.md#constructor)

### Properties

* [code](_util_errors_.jwssignatureverificationfailed.md#code)
* [message](_util_errors_.jwssignatureverificationfailed.md#message)
* [name](_util_errors_.jwssignatureverificationfailed.md#name)
* [stack](_util_errors_.jwssignatureverificationfailed.md#stack)

## Constructors

### constructor

\+ **new JWSSignatureVerificationFailed**(`message?`: string): [JWSSignatureVerificationFailed](_util_errors_.jwssignatureverificationfailed.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWSSignatureVerificationFailed](_util_errors_.jwssignatureverificationfailed.md)

## Properties

### code

•  **code**: string = "ERR\_JWS\_SIGNATURE\_VERIFICATION\_FAILED"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:126](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L126)*

___

### message

•  **message**: string = "signature verification failed"

*Overrides [JOSEError](_util_errors_.joseerror.md).[message](_util_errors_.joseerror.md#message)*

*Defined in [src/util/errors.ts:128](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L128)*

___

### name

•  **name**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### stack

• `Optional` **stack**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*
