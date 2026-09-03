# Interface: ComposedFlattenedEncryptConstructor\<Header\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Constructor for a Flattened JWE encryptor with the selected header type.

## Type Parameters

| Type Parameter |
| ------ |
| `Header` *extends* [`JWEHeaderParameters`](../../../../../types/interfaces/JWEHeaderParameters.md) |

## Constructors

### Constructor

▸ **new ComposedFlattenedEncryptConstructor**(`plaintext`): [`ComposedFlattenedEncrypt`](ComposedFlattenedEncrypt.md)

JWE producer constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the plaintext to encrypt. |

#### Returns

[`ComposedFlattenedEncrypt`](ComposedFlattenedEncrypt.md)

## Properties

### prototype

• `readonly` **prototype**: [`ComposedFlattenedEncrypt`](ComposedFlattenedEncrypt.md)
