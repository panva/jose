# Class: JOSEError

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Base class for JOSE errors.

## Example

Checking thrown error is a JOSE one

```js
if (err instanceof jose.errors.JOSEError) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JOSE_GENERIC'`

Stable code identifying the error class. Use [AnyJOSEError](../type-aliases/AnyJOSEError.md) to narrow subclasses by code.
