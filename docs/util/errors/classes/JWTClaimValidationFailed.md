# Class: JWTClaimValidationFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

An error subclass thrown when a JWT Claim Set member validation fails.

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

### claim

• **claim**: `string`

The Claim for which the validation failed.

***

### code

• **code**: `string` = `'ERR_JWT_CLAIM_VALIDATION_FAILED'`

A unique error code for [JWTClaimValidationFailed](JWTClaimValidationFailed.md).

***

### payload

• **payload**: [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

The parsed JWT Claims Set (aka payload). Other JWT claims may or may not have been verified at
this point. The JSON Web Signature (JWS) or a JSON Web Encryption (JWE) structures' integrity
has however been verified. Claims Set verification happens after the JWS Signature or JWE
Decryption processes.

***

### reason

• **reason**: `string`

Reason code for the validation failure.
