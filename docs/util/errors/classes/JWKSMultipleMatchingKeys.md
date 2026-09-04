# Class: JWKSMultipleMatchingKeys

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Thrown when multiple keys match in a JWKS.

## Examples

Checking thrown error is this one using a stable error code

```js
if (err.code === 'ERR_JWKS_MULTIPLE_MATCHING_KEYS') {
  // ...
}
```

Checking thrown error is this one using `instanceof`

```js
if (err instanceof jose.errors.JWKSMultipleMatchingKeys) {
  // ...
}
```

## Properties

### \[asyncIterator\]

• **\[asyncIterator\]**: () => `AsyncIterableIterator`\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

Iterates the public keys that matched the JWS JOSE Header, so that verification can be
attempted with each in turn. See the [createRemoteJWKSet](../../../jwks/remote/functions/createRemoteJWKSet.md)
and [createLocalJWKSet](../../../jwks/local/functions/createLocalJWKSet.md) examples. Instances thrown by this
module always iterate the matched keys; an instance constructed by other code iterates
nothing.

#### Returns

`AsyncIterableIterator`\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

***

### code

• **code**: `string` = `'ERR_JWKS_MULTIPLE_MATCHING_KEYS'`

A unique error code for JWKSMultipleMatchingKeys.
