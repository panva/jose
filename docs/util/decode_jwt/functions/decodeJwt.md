# Function: decodeJwt()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

▸ **decodeJwt**\<`PayloadType`\>(`jwt`): `PayloadType` & [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

Decodes the Claims Set of a JWS-formatted JSON Web Token without verifying the signature.

This does not validate the JWT Claims Set types or values. Use `jose.jwtVerify()` for signed JWT
validation and `jose.jwtDecrypt()` for encrypted JWT validation.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jwt/decode'`.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the token is expected to carry. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` | JWT token in compact JWS serialization. |

## Returns

`PayloadType` & [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

## Example

```js
const claims = jose.decodeJwt(token)
console.log(claims)
```
