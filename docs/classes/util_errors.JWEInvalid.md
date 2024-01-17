# Class: JWEInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when a JWE is invalid.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWE_INVALID') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWEInvalid) {
  // ...
}
```

## Table of contents

### Properties

- [code](util_errors.JWEInvalid.md#code)

## Properties

### code

• **code**: `string` = `'ERR_JWE_INVALID'`

A unique error code for this particular error subclass.
