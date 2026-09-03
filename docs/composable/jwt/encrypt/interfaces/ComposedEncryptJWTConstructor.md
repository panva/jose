# Interface: ComposedEncryptJWTConstructor\<Header\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Constructor for an encrypted JWT producer with the selected header type.

## Type Parameters

| Type Parameter |
| ------ |
| `Header` |

## Constructors

### Constructor

▸ **new ComposedEncryptJWTConstructor**(`payload?`): [`ComposedEncryptJWT`](ComposedEncryptJWT.md)

JWT producer constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload?` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

#### Returns

[`ComposedEncryptJWT`](ComposedEncryptJWT.md)

## Properties

### prototype

• `readonly` **prototype**: [`ComposedEncryptJWT`](ComposedEncryptJWT.md)
