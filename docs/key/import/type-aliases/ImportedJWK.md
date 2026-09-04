# Type Alias: ImportedJWK\<JWKType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **ImportedJWK**\<`JWKType`\> = `JWKType` *extends* `object` ? [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) : `JWKType` *extends* `object` ? [`CryptoKey`](../../../types/type-aliases/CryptoKey.md) : [`CryptoKey`](../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Maps a JWK key type to the value returned by [importJWK](../functions/importJWK.md).

The "kty" (Key Type) Parameter fully determines the outcome at runtime: `"oct"` yields a
[Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) secret and every other supported key type yields a
[CryptoKey](../../../types/type-aliases/CryptoKey.md). When "kty" is not statically known — the usual case for a JWK
parsed from JSON or typed as [JWK](../../../types/type-aliases/JWK.md) — this resolves to their union.

## Type Parameters

| Type Parameter |
| ------ |
| `JWKType` *extends* [`JWK`](../../../types/type-aliases/JWK.md) |
