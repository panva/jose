# Class: JWKSMultipleMatchingKeys

[util/errors](../modules/util_errors.md).JWKSMultipleMatchingKeys

An error subclass thrown when multiple keys match from a JWKS.

## Hierarchy

* [*JOSEError*](util_errors.joseerror.md)

  ↳ **JWKSMultipleMatchingKeys**

## Table of contents

### Constructors

- [constructor](util_errors.jwksmultiplematchingkeys.md#constructor)

### Properties

- [code](util_errors.jwksmultiplematchingkeys.md#code)
- [message](util_errors.jwksmultiplematchingkeys.md#message)
- [code](util_errors.jwksmultiplematchingkeys.md#code)

## Constructors

### constructor

\+ **new JWKSMultipleMatchingKeys**(`message?`: *string*): [*JWKSMultipleMatchingKeys*](util_errors.jwksmultiplematchingkeys.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JWKSMultipleMatchingKeys*](util_errors.jwksmultiplematchingkeys.md)

Inherited from: [JOSEError](util_errors.joseerror.md)

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/main/src/util/errors.ts#L16)

## Properties

### code

• **code**: *string*

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:144](https://github.com/panva/jose/blob/main/src/util/errors.ts#L144)

___

### message

• **message**: *string*= 'multiple matching keys found in the JSON Web Key Set'

Overrides: void

Defined in: [util/errors.ts:146](https://github.com/panva/jose/blob/main/src/util/errors.ts#L146)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JWKS\_MULTIPLE\_MATCHING\_KEYS'

A unique error code for the particular error subclass.

Overrides: [JOSEError](util_errors.joseerror.md).[code](util_errors.joseerror.md#code)

Defined in: [util/errors.ts:142](https://github.com/panva/jose/blob/main/src/util/errors.ts#L142)
