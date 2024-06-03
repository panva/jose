# Class: JWTClaimValidationFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWT Claim Set member validation fails.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWTClaimValidationFailed) {
  // ...
}
```

## Implemented by

- [`JWTExpired`](util_errors.JWTExpired.md)

## Table of contents

### Properties

- [claim](util_errors.JWTClaimValidationFailed.md#claim)
- [code](util_errors.JWTClaimValidationFailed.md#code)
- [payload](util_errors.JWTClaimValidationFailed.md#payload)
- [reason](util_errors.JWTClaimValidationFailed.md#reason)

## Properties

### claim

• **claim**: `string`

The Claim for which the validation failed.

___

### code

• **code**: `string` = `'ERR_JWT_CLAIM_VALIDATION_FAILED'`

A unique error code for this particular error subclass.

___

### payload

• **payload**: [`JWTPayload`](../interfaces/types.JWTPayload.md)

The parsed JWT payload.

___

### reason

• **reason**: `string`

Reason code for the validation failure.
