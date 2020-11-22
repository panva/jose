# Class: JWKSMultipleMatchingKeys

An error subclass thrown when multiple keys match from a JWKS.

## Index

### Constructors

* [constructor](_util_errors_.jwksmultiplematchingkeys.md#constructor)

### Properties

* [code](_util_errors_.jwksmultiplematchingkeys.md#code)
* [message](_util_errors_.jwksmultiplematchingkeys.md#message)
* [name](_util_errors_.jwksmultiplematchingkeys.md#name)
* [stack](_util_errors_.jwksmultiplematchingkeys.md#stack)

## Constructors

### constructor

\+ **new JWKSMultipleMatchingKeys**(`message?`: string): [JWKSMultipleMatchingKeys](_util_errors_.jwksmultiplematchingkeys.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWKSMultipleMatchingKeys](_util_errors_.jwksmultiplematchingkeys.md)

## Properties

### code

•  **code**: string = "ERR\_JWKS\_MULTIPLE\_MATCHING\_KEYS"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:117](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L117)*

___

### message

•  **message**: string = "multiple matching keys found in the JSON Web Key Set"

*Overrides [JOSEError](_util_errors_.joseerror.md).[message](_util_errors_.joseerror.md#message)*

*Defined in [src/util/errors.ts:119](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L119)*

___

### name

•  **name**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### stack

• `Optional` **stack**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*
