# Class: JOSEAlgNotAllowed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when an algorithm is disallowed by configuration.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JOSE_ALG_NOT_ALLOWED') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JOSEAlgNotAllowed) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JOSE_ALG_NOT_ALLOWED'`

A unique error code for JOSEAlgNotAllowed.
