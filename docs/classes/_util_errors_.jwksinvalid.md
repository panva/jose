# Class: JWKSInvalid

An error subclass thrown when a JWKS is invalid.

## Index

### Constructors

* [constructor](_util_errors_.jwksinvalid.md#constructor)

### Properties

* [code](_util_errors_.jwksinvalid.md#code)
* [message](_util_errors_.jwksinvalid.md#message)
* [name](_util_errors_.jwksinvalid.md#name)
* [stack](_util_errors_.jwksinvalid.md#stack)

## Constructors

### constructor

\+ **new JWKSInvalid**(`message?`: string): [JWKSInvalid](_util_errors_.jwksinvalid.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWKSInvalid](_util_errors_.jwksinvalid.md)

## Properties

### code

•  **code**: string = "ERR\_JWKS\_INVALID"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:101](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L101)*

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
