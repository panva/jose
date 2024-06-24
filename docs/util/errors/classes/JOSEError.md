# Class: JOSEError

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A generic Error that all other JOSE specific Error subclasses extend.

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

A unique error code for this particular error subclass.
