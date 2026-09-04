# Interface: JWTVerifyResult\<PayloadType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Signed JSON Web Token (JWT) verification result.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](JWTPayload.md) | Type definition of the JWT Claims Set the token is expected to carry. |

## Properties

### payload

• **payload**: `PayloadType` & [`JWTPayload`](JWTPayload.md)

JWT Claims Set.

***

### protectedHeader

• **protectedHeader**: [`JWTHeaderParameters`](JWTHeaderParameters.md)

JWS Protected Header.
