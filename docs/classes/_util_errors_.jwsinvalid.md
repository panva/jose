# Class: JWSInvalid

An error subclass thrown when a JWS is invalid.

## Index

### Constructors

* [constructor](_util_errors_.jwsinvalid.md#constructor)

### Properties

* [code](_util_errors_.jwsinvalid.md#code)
* [message](_util_errors_.jwsinvalid.md#message)
* [name](_util_errors_.jwsinvalid.md#name)
* [stack](_util_errors_.jwsinvalid.md#stack)

## Constructors

### constructor

\+ **new JWSInvalid**(`message?`: string): [JWSInvalid](_util_errors_.jwsinvalid.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWSInvalid](_util_errors_.jwsinvalid.md)

## Properties

### code

•  **code**: string = "ERR\_JWS\_INVALID"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:80](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L80)*

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
