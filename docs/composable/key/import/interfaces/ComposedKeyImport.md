# Interface: ComposedKeyImport\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Key import functions restricted to the algorithms selected by [composeKeyImport](../functions/composeKeyImport.md).

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Properties

### importJWK

• `readonly` **importJWK**: \<`JWKType`\>(`jwk`, `alg?`, `options?`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`ImportedJWK`](../../../../key/import/type-aliases/ImportedJWK.md)\<`JWKType`\>\>

#### Type Parameters

| Type Parameter |
| ------ |
| `JWKType` *extends* [`JWK`](../../../../types/type-aliases/JWK.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `jwk` | `JWKType` |
| `alg?` | `Algorithm` |
| `options?` | [`KeyImportOptions`](../../../../key/import/interfaces/KeyImportOptions.md) |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`ImportedJWK`](../../../../key/import/type-aliases/ImportedJWK.md)\<`JWKType`\>\>

***

### importPKCS8

• `readonly` **importPKCS8**: (`pkcs8`, `alg`, `options?`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pkcs8` | `string` |
| `alg` | `Algorithm` |
| `options?` | [`KeyImportOptions`](../../../../key/import/interfaces/KeyImportOptions.md) |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

***

### importSPKI

• `readonly` **importSPKI**: (`spki`, `alg`, `options?`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `spki` | `string` |
| `alg` | `Algorithm` |
| `options?` | [`KeyImportOptions`](../../../../key/import/interfaces/KeyImportOptions.md) |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

***

### importX509

• `readonly` **importX509**: (`x509`, `alg`, `options?`) => [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x509` | `string` |
| `alg` | `Algorithm` |
| `options?` | [`KeyImportOptions`](../../../../key/import/interfaces/KeyImportOptions.md) |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>
