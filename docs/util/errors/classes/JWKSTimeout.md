# Class: JWKSTimeout

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when fetching a remote JWKS times out.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_TIMEOUT') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSTimeout) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JWKS_TIMEOUT'`

A unique error code for JWKSTimeout.
