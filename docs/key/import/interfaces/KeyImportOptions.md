# Interface: KeyImportOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Key import options.

## Properties

### extractable?

• `optional` **extractable?**: `boolean`

Whether the imported CryptoKey is extractable. Overrides JWK "ext" when set. Without either,
defaults to false for private keys, true otherwise.
