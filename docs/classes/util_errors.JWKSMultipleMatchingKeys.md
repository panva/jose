# Class: JWKSMultipleMatchingKeys

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

An error subclass thrown when multiple keys match from a JWKS.

**`Example`**

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
  // ...
}
```

**`Example`**

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSMultipleMatchingKeys) {
  // ...
}
```

## Table of contents

### Properties

- [code](util_errors.JWKSMultipleMatchingKeys.md#code)

## Properties

### code

• **code**: `string` = `'ERR_JWKS_MULTIPLE_MATCHING_KEYS'`

A unique error code for this particular error subclass.
