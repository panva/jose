# Class: JOSEError

A generic Error subclass that all other specific
JOSE Error subclasses inherit from.

## Index

### Constructors

* [constructor](_util_errors_.joseerror.md#constructor)

### Properties

* [code](_util_errors_.joseerror.md#code)
* [message](_util_errors_.joseerror.md#message)
* [name](_util_errors_.joseerror.md#name)
* [stack](_util_errors_.joseerror.md#stack)
* [Error](_util_errors_.joseerror.md#error)

## Constructors

### constructor

\+ **new JOSEError**(`message?`: string): [JOSEError](_util_errors_.joseerror.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JOSEError](_util_errors_.joseerror.md)

## Properties

### code

•  **code**: string = "ERR\_JOSE\_GENERIC"

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

A unique error code for the particular error subclass.

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

___

### Error

▪ `Static` **Error**: ErrorConstructor

*Defined in node_modules/typescript/lib/lib.es5.d.ts:984*
