# Class: JWEDecryptionFailed

An error subclass thrown when a JWE ciphertext decryption fails.

## Index

### Constructors

* [constructor](_util_errors_.jwedecryptionfailed.md#constructor)

### Properties

* [code](_util_errors_.jwedecryptionfailed.md#code)
* [message](_util_errors_.jwedecryptionfailed.md#message)
* [name](_util_errors_.jwedecryptionfailed.md#name)
* [stack](_util_errors_.jwedecryptionfailed.md#stack)

## Constructors

### constructor

\+ **new JWEDecryptionFailed**(`message?`: string): [JWEDecryptionFailed](_util_errors_.jwedecryptionfailed.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWEDecryptionFailed](_util_errors_.jwedecryptionfailed.md)

## Properties

### code

•  **code**: string = "ERR\_JWE\_DECRYPTION\_FAILED"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:64](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L64)*

___

### message

•  **message**: string = "decryption operation failed"

*Overrides [JOSEError](_util_errors_.joseerror.md).[message](_util_errors_.joseerror.md#message)*

*Defined in [src/util/errors.ts:66](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L66)*

___

### name

•  **name**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### stack

• `Optional` **stack**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*
