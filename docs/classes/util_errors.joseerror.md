# Class: JOSEError

[util/errors](../modules/util_errors.md).JOSEError

A generic Error subclass that all other specific
JOSE Error subclasses inherit from.

## Hierarchy

* *Error*

  ↳ **JOSEError**

  ↳↳ [*JWTClaimValidationFailed*](util_errors.jwtclaimvalidationfailed.md)

  ↳↳ [*JOSEAlgNotAllowed*](util_errors.josealgnotallowed.md)

  ↳↳ [*JOSENotSupported*](util_errors.josenotsupported.md)

  ↳↳ [*JWEDecryptionFailed*](util_errors.jwedecryptionfailed.md)

  ↳↳ [*JWEInvalid*](util_errors.jweinvalid.md)

  ↳↳ [*JWSInvalid*](util_errors.jwsinvalid.md)

  ↳↳ [*JWTInvalid*](util_errors.jwtinvalid.md)

  ↳↳ [*JWKInvalid*](util_errors.jwkinvalid.md)

  ↳↳ [*JWKSInvalid*](util_errors.jwksinvalid.md)

  ↳↳ [*JWKSNoMatchingKey*](util_errors.jwksnomatchingkey.md)

  ↳↳ [*JWKSMultipleMatchingKeys*](util_errors.jwksmultiplematchingkeys.md)

  ↳↳ [*JWSSignatureVerificationFailed*](util_errors.jwssignatureverificationfailed.md)

## Table of contents

### Constructors

- [constructor](util_errors.joseerror.md#constructor)

### Properties

- [code](util_errors.joseerror.md#code)
- [code](util_errors.joseerror.md#code)

## Constructors

### constructor

\+ **new JOSEError**(`message?`: *string*): [*JOSEError*](util_errors.joseerror.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*JOSEError*](util_errors.joseerror.md)

Overrides: Error.constructor

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/v3.11.5/src/util/errors.ts#L16)

## Properties

### code

• **code**: *string*

A unique error code for the particular error subclass.

Defined in: [util/errors.ts:16](https://github.com/panva/jose/blob/v3.11.5/src/util/errors.ts#L16)

___

### code

▪ `Static` **code**: *string*= 'ERR\_JOSE\_GENERIC'

A unique error code for the particular error subclass.

Defined in: [util/errors.ts:11](https://github.com/panva/jose/blob/v3.11.5/src/util/errors.ts#L11)
