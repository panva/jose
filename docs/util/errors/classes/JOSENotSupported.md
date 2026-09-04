# Class: JOSENotSupported

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when a feature or algorithm is unsupported.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JOSE_NOT_SUPPORTED') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JOSENotSupported) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JOSE_NOT_SUPPORTED'`

A unique error code for JOSENotSupported.
