# Type Alias: GeneratedSecret\<Alg\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **GeneratedSecret**\<`Alg`\> = `Alg` *extends* `"A128CBC-HS256"` \| `"A192CBC-HS384"` \| `"A256CBC-HS512"` ? [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) : `string` *extends* `Alg` ? [`CryptoKey`](../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) : [`CryptoKey`](../../../types/type-aliases/CryptoKey.md)

Maps a JWA algorithm identifier to the value returned by [generateSecret](../functions/generateSecret.md). AES-CBC-HMAC
algorithms return [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array); other supported algorithms return
[CryptoKey](../../../types/type-aliases/CryptoKey.md). When the algorithm is not statically known, the result is their
union.

## Type Parameters

| Type Parameter |
| ------ |
| `Alg` *extends* `string` |
