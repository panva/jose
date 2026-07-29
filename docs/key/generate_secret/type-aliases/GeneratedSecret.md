# Type Alias: GeneratedSecret\<Alg\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **GeneratedSecret**\<`Alg`\> = `Alg` *extends* `"A128CBC-HS256"` \| `"A192CBC-HS384"` \| `"A256CBC-HS512"` ? [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) : `string` *extends* `Alg` ? [`CryptoKey`](../../../types/type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) : [`CryptoKey`](../../../types/type-aliases/CryptoKey.md)

Resolves what [generateSecret](../functions/generateSecret.md) returns for a given JWA Algorithm Identifier. The
AES_CBC_HMAC_SHA2 content encryption algorithms have no [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) representation, so they
yield a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array); every other supported identifier yields a
[CryptoKey](../../../types/type-aliases/CryptoKey.md). When the identifier is not statically known this resolves to
their union.

## Type Parameters

| Type Parameter |
| ------ |
| `Alg` *extends* `string` |
