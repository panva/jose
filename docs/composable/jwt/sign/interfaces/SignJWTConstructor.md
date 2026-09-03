# Interface: SignJWTConstructor\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Constructor returned by [composeSignJWT](../functions/composeSignJWT.md).

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Constructors

### Constructor

▸ **new SignJWTConstructor**(`payload?`): [`SignJWTInstance`](SignJWTInstance.md)

JWT producer constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload?` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) | The JWT Claims Set object. Defaults to an empty object. |

#### Returns

[`SignJWTInstance`](SignJWTInstance.md)

## Properties

### prototype

• `readonly` **prototype**: [`SignJWTInstance`](SignJWTInstance.md)
