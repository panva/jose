# Class: JWTExpired

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when a JWT has expired or exceeds the configured maximum token age.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWT_EXPIRED') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWTExpired) {
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

• **code**: `string` = `'ERR_JWT_EXPIRED'`

A unique error code for JWTExpired.

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
