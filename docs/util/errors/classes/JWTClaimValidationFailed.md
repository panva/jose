# Class: JWTClaimValidationFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when JWT claim or header validation fails. Expiration is reported separately as
[JWTExpired](JWTExpired.md).

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWTClaimValidationFailed) {
  // ...
}
```

## Properties

### cause

• **cause**: [`JWTClaimValidationFailure`](../interfaces/JWTClaimValidationFailure.md)

The [JWTClaimValidationFailure](../interfaces/JWTClaimValidationFailure.md) details carried by this error.

***

### claim

• **claim**: `string`

Claim or header that failed validation.

***

### code

• **code**: `string` = `'ERR_JWT_CLAIM_VALIDATION_FAILED'`

A unique error code for JWTClaimValidationFailed.

***

### payload

• **payload**: [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

The parsed JWT Claims Set; validation of other claims may be incomplete. With
[jwtVerify](../../../jwt/verify/functions/jwtVerify.md) and [jwtDecrypt](../../../jwt/decrypt/functions/jwtDecrypt.md), token
authentication precedes claim validation. [jwt/unsecured.UnsecuredJWT.decode](../../../jwt/unsecured/classes/UnsecuredJWT.md#decode) does not
authenticate tokens.

***

### reason

• **reason**: `string`

Reason code for the validation failure.
