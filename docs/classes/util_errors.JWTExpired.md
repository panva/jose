# Class: JWTExpired

[util/errors](../modules/util_errors.md).JWTExpired

An error subclass thrown when a JWT is expired.

## Hierarchy

- [`JWTClaimValidationFailed`](util_errors.JWTClaimValidationFailed.md)

  ↳ **`JWTExpired`**

## Table of contents

### Constructors

- [constructor](util_errors.JWTExpired.md#constructor)

### Properties

- [claim](util_errors.JWTExpired.md#claim)
- [code](util_errors.JWTExpired.md#code)
- [reason](util_errors.JWTExpired.md#reason)
- [code](util_errors.JWTExpired.md#code)

## Constructors

### constructor

• **new JWTExpired**(`message`, `claim?`, `reason?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `undefined` |
| `claim` | `string` | `'unspecified'` |
| `reason` | `string` | `'unspecified'` |

#### Inherited from

[JWTClaimValidationFailed](util_errors.JWTClaimValidationFailed.md).[constructor](util_errors.JWTClaimValidationFailed.md#constructor)

#### Defined in

[util/errors.ts:45](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L45)

## Properties

### claim

• **claim**: `string`

The Claim for which the validation failed.

#### Inherited from

[JWTClaimValidationFailed](util_errors.JWTClaimValidationFailed.md).[claim](util_errors.JWTClaimValidationFailed.md#claim)

#### Defined in

[util/errors.ts:38](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L38)

___

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Overrides

[JWTClaimValidationFailed](util_errors.JWTClaimValidationFailed.md).[code](util_errors.JWTClaimValidationFailed.md#code)

#### Defined in

[util/errors.ts:166](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L166)

___

### reason

• **reason**: `string`

Reason code for the validation failure.

#### Inherited from

[JWTClaimValidationFailed](util_errors.JWTClaimValidationFailed.md).[reason](util_errors.JWTClaimValidationFailed.md#reason)

#### Defined in

[util/errors.ts:43](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L43)

___

### code

▪ `Static` **code**: `string` = `'ERR_JWT_EXPIRED'`

A unique error code for the particular error subclass.

#### Overrides

[JWTClaimValidationFailed](util_errors.JWTClaimValidationFailed.md).[code](util_errors.JWTClaimValidationFailed.md#code)

#### Defined in

[util/errors.ts:164](https://github.com/panva/jose/blob/v3.14.2/src/util/errors.ts#L164)
