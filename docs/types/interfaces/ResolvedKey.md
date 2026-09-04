# Interface: ResolvedKey\<KeyType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Key resolver result metadata.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `KeyType` *extends* [`CryptoKey`](../type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`CryptoKey`](../type-aliases/CryptoKey.md) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Type of the resolved key. Inferred from the key resolver function's return type, so a resolver declared to return only [CryptoKey](../type-aliases/CryptoKey.md) — as [createRemoteJWKSet](../../jwks/remote/functions/createRemoteJWKSet.md), [createLocalJWKSet](../../jwks/local/functions/createLocalJWKSet.md), and [EmbeddedJWK](../../jwk/embedded/functions/EmbeddedJWK.md) all are — needs no narrowing at the call site. |

## Properties

### key

• **key**: `KeyType`

Key resolved from the key resolver function.
