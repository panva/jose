# Class: JOSEError

[util/errors](../modules/util_errors.md).JOSEError

A generic Error subclass that all other specific
JOSE Error subclasses inherit from.

## Hierarchy

- `Error`

  ↳ **`JOSEError`**

  ↳↳ [`JWTClaimValidationFailed`](util_errors.JWTClaimValidationFailed.md)

  ↳↳ [`JOSEAlgNotAllowed`](util_errors.JOSEAlgNotAllowed.md)

  ↳↳ [`JOSENotSupported`](util_errors.JOSENotSupported.md)

  ↳↳ [`JWEDecryptionFailed`](util_errors.JWEDecryptionFailed.md)

  ↳↳ [`JWEInvalid`](util_errors.JWEInvalid.md)

  ↳↳ [`JWSInvalid`](util_errors.JWSInvalid.md)

  ↳↳ [`JWTInvalid`](util_errors.JWTInvalid.md)

  ↳↳ [`JWKInvalid`](util_errors.JWKInvalid.md)

  ↳↳ [`JWKSInvalid`](util_errors.JWKSInvalid.md)

  ↳↳ [`JWKSNoMatchingKey`](util_errors.JWKSNoMatchingKey.md)

  ↳↳ [`JWKSMultipleMatchingKeys`](util_errors.JWKSMultipleMatchingKeys.md)

  ↳↳ [`JWSSignatureVerificationFailed`](util_errors.JWSSignatureVerificationFailed.md)

## Table of contents

### Constructors

- [constructor](util_errors.JOSEError.md#constructor)

### Properties

- [code](util_errors.JOSEError.md#code)
- [code](util_errors.JOSEError.md#code)

## Constructors

### constructor

• **new JOSEError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Overrides

Error.constructor

#### Defined in

[util/errors.ts:18](https://github.com/panva/jose/blob/v3.14.3/src/util/errors.ts#L18)

## Properties

### code

• **code**: `string`

A unique error code for the particular error subclass.

#### Defined in

[util/errors.ts:16](https://github.com/panva/jose/blob/v3.14.3/src/util/errors.ts#L16)

___

### code

▪ `Static` **code**: `string` = `'ERR_JOSE_GENERIC'`

A unique error code for the particular error subclass.

#### Defined in

[util/errors.ts:11](https://github.com/panva/jose/blob/v3.14.3/src/util/errors.ts#L11)
