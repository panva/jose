# Interface: CryptoKeyStructuralFallback

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

**`Internal`**

Used as [CryptoKey](../type-aliases/CryptoKey.md) only when the host runtime's `crypto` global is not typed at all, e.g. a
consumer compiling with neither the DOM lib nor `@types/node`. Whenever a `CryptoKey` type is
available it is aliased instead, deliberately, so that this module never introduces a competing
nominal `CryptoKey` and values flow freely to and from [SubtleCrypto](https://developer.mozilla.org/docs/Web/API/SubtleCrypto) APIs.

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

• `readonly` **type**: `"private"` \| `"public"` \| `"secret"`

***

### usages

• `readonly` **usages**: (`"decrypt"` \| `"deriveBits"` \| `"deriveKey"` \| `"encrypt"` \| `"sign"` \| `"unwrapKey"` \| `"verify"` \| `"wrapKey"`)[]
