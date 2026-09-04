# Class: JWKSNoMatchingKey

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when no keys match in a JWKS.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_NO_MATCHING_KEY') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSNoMatchingKey) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JWKS_NO_MATCHING_KEY'`

A unique error code for JWKSNoMatchingKey.
