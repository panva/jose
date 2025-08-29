# Class: JWKSInvalid

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

An error subclass thrown when a JWKS is invalid.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_INVALID') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSInvalid) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JWKS_INVALID'`

A unique error code for JWKSInvalid.
