# Class: JWSSignatureVerificationFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when JWS signature verification fails.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
  // ...
}
```

## Table of contents

### Properties

- [code](util_errors.JWSSignatureVerificationFailed.md#code)

## Properties

### code

• **code**: `string` = `'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'`

A unique error code for this particular error subclass.
