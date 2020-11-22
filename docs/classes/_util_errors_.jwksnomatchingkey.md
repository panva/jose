# Class: JWKSNoMatchingKey

An error subclass thrown when no keys match from a JWKS.

## Index

### Constructors

* [constructor](_util_errors_.jwksnomatchingkey.md#constructor)

### Properties

* [code](_util_errors_.jwksnomatchingkey.md#code)
* [message](_util_errors_.jwksnomatchingkey.md#message)
* [name](_util_errors_.jwksnomatchingkey.md#name)
* [stack](_util_errors_.jwksnomatchingkey.md#stack)

## Constructors

### constructor

\+ **new JWKSNoMatchingKey**(`message?`: string): [JWKSNoMatchingKey](_util_errors_.jwksnomatchingkey.md)

*Defined in [src/util/errors.ts:11](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`message?` | string |

**Returns:** [JWKSNoMatchingKey](_util_errors_.jwksnomatchingkey.md)

## Properties

### code

•  **code**: string = "ERR\_JWKS\_NO\_MATCHING\_KEY"

*Overrides [JOSEError](_util_errors_.joseerror.md).[code](_util_errors_.joseerror.md#code)*

*Defined in [src/util/errors.ts:108](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L108)*

___

### message

•  **message**: string = "no applicable key found in the JSON Web Key Set"

*Overrides [JOSEError](_util_errors_.joseerror.md).[message](_util_errors_.joseerror.md#message)*

*Defined in [src/util/errors.ts:110](https://github.com/panva/jose/blob/v3.1.0/src/util/errors.ts#L110)*

___

### name

•  **name**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### stack

• `Optional` **stack**: string

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*
