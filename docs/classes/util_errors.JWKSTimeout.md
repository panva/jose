# Class: JWKSTimeout

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Timeout was reached when retrieving the JWKS response.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_TIMEOUT') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSTimeout) {
  // ...
}
```

## Table of contents

### Properties

- [code](util_errors.JWKSTimeout.md#code)
- [message](util_errors.JWKSTimeout.md#message)

## Properties

### code

• **code**: `string` = `'ERR_JWKS_TIMEOUT'`

A unique error code for this particular error subclass.

___

### message

• **message**: `string` = `'request timed out'`
