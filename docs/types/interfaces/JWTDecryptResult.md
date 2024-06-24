# Interface: JWTDecryptResult\<PayloadType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](JWTPayload.md) |

## Properties

### payload

• **payload**: `PayloadType` & [`JWTPayload`](JWTPayload.md)

JWT Claims Set.

***

### protectedHeader

• **protectedHeader**: [`CompactJWEHeaderParameters`](CompactJWEHeaderParameters.md)

JWE Protected Header.
