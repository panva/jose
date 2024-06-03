# Class: JWTExpired

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWT is expired.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWT_EXPIRED') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWTExpired) {
  // ...
}
```

## Implements

- [`JWTClaimValidationFailed`](util_errors.JWTClaimValidationFailed.md)

## Table of contents

### Properties

- [claim](util_errors.JWTExpired.md#claim)
- [code](util_errors.JWTExpired.md#code)
- [payload](util_errors.JWTExpired.md#payload)
- [reason](util_errors.JWTExpired.md#reason)

## Properties

### claim

• **claim**: `string`

The Claim for which the validation failed.

___

### code

• **code**: `string` = `'ERR_JWT_EXPIRED'`

A unique error code for this particular error subclass.

___

### payload

• **payload**: [`JWTPayload`](../interfaces/types.JWTPayload.md)

The parsed JWT payload.

___

### reason

• **reason**: `string`

Reason code for the validation failure.
