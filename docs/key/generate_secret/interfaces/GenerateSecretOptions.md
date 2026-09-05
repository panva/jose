# Interface: GenerateSecretOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Secret generation options.

## Properties

### extractable?

• `optional` **extractable?**: `boolean`

Whether the generated CryptoKey is extractable. Defaults to false; has no effect for
A128CBC-HS256, A192CBC-HS384, and A256CBC-HS512, which return raw bytes.
