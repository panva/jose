# Type Alias: CryptoKey

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **CryptoKey** = *typeof* `globalThis` *extends* `object` ? [`Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)\<`R`, \{ `type`: `string`; \}\> : [`CryptoKeyStructuralFallback`](../interfaces/CryptoKeyStructuralFallback.md)

[CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) is a representation of a key/secret available in all supported runtimes. In
addition to the [Key Import Functions](../../key/import/README.md) you may use the
[SubtleCrypto.importKey](https://developer.mozilla.org/docs/Web/API/SubtleCrypto/importKey) API to obtain a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) from your existing key
material.
