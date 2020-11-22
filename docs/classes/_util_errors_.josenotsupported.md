# Class: JOSENotSupported

An error subclass thrown when a particular feature or algorithm is not supported by this
implementation or JOSE in general.

## Index

### Constructors

* [constructor](_util_errors_.josenotsupported.md#constructor)

### Properties

* [code](_util_errors_.josenotsupported.md#code)
* [message](_util_errors_.josenotsupported.md#message)
* [name](_util_errors_.josenotsupported.md#name)
* [stack](_util_errors_.josenotsupported.md#stack)

## Constructors

### constructor

\+ **new JOSENotSupported**(`message?`: string): [JOSENotSupported](_util_errors_.josenotsupported.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JOSENotSupported](_util_errors_.josenotsupported.md)

## Properties

### code

•  **code**: string = "ERR\_JOSE\_NOT\_SUPPORTED"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:57](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L57)*

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
