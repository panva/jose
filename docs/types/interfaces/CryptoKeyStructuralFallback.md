# Interface: CryptoKeyStructuralFallback

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

**`Internal`**

Used as [CryptoKey](../type-aliases/CryptoKey.md) when the host runtime's `crypto` global is not exposed on `typeof
globalThis`, including when it is absent from ambient types or declared with `const` or `let`. It
remains structurally compatible with host [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) declarations so values flow freely to
and from [SubtleCrypto](https://developer.mozilla.org/docs/Web/API/SubtleCrypto) APIs.

## Properties

### algorithm

• `readonly` **algorithm**: `object`

#### name

• **name**: `string`

***

### extractable

• `readonly` **extractable**: `boolean`

***

### type

• `readonly` **type**: `string`

***

### usages

• `readonly` **usages**: `string`[]
