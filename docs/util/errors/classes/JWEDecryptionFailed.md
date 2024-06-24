# Class: JWEDecryptionFailed

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

An error subclass thrown when a JWE ciphertext decryption fails.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWE_DECRYPTION_FAILED') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWEDecryptionFailed) {
  // ...
}
```

## Properties

### code

• **code**: `string` = `'ERR_JWE_DECRYPTION_FAILED'`

A unique error code for this particular error subclass.
