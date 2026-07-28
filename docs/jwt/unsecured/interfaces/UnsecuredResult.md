# Interface: UnsecuredResult\<PayloadType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Result of decoding an Unsecured JWT.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the token is expected to carry. |

## Properties

### header

• **header**: [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md)

The decoded JOSE Header; always `{ "alg": "none" }` for an Unsecured JWT.

***

### payload

• **payload**: `PayloadType` & [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

JWT Claims Set.
