# Class: JWKSNoMatchingKey

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when no keys match from a JWKS.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_NO_MATCHING_KEY') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSNoMatchingKey) {
  // ...
}
```

## Table of contents

### Properties

- [code](util_errors.JWKSNoMatchingKey.md#code)

## Properties

### code

• **code**: `string` = `'ERR_JWKS_NO_MATCHING_KEY'`

A unique error code for this particular error subclass.
