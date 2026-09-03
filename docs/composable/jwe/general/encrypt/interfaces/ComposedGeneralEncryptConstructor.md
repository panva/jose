# Interface: ComposedGeneralEncryptConstructor\<Header\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Constructor for a General JWE encryptor with the selected header type.

## Type Parameters

| Type Parameter |
| ------ |
| `Header` *extends* [`JWEHeaderParameters`](../../../../../types/interfaces/JWEHeaderParameters.md) |

## Constructors

### Constructor

▸ **new ComposedGeneralEncryptConstructor**(`plaintext`): [`ComposedGeneralEncrypt`](ComposedGeneralEncrypt.md)

JWE producer constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

[`ComposedGeneralEncrypt`](ComposedGeneralEncrypt.md)

## Properties

### prototype

• `readonly` **prototype**: [`ComposedGeneralEncrypt`](ComposedGeneralEncrypt.md)
