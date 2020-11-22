# Class: JWTInvalid

An error subclass thrown when a JWT is invalid.

## Index

### Constructors

* [constructor](_util_errors_.jwtinvalid.md#constructor)

### Properties

* [code](_util_errors_.jwtinvalid.md#code)
* [message](_util_errors_.jwtinvalid.md#message)
* [name](_util_errors_.jwtinvalid.md#name)
* [stack](_util_errors_.jwtinvalid.md#stack)

## Constructors

### constructor

\+ **new JWTInvalid**(`message?`: string): [JWTInvalid](_util_errors_.jwtinvalid.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWTInvalid](_util_errors_.jwtinvalid.md)

## Properties

### code

•  **code**: string = "ERR\_JWT\_INVALID"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:87](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L87)*

___

### message

•  **message**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:974*

___

### name

•  **name**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### stack

• `Optional` **stack**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*
