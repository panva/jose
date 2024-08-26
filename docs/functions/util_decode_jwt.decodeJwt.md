# Function: decodeJwt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **decodeJwt**\<`PayloadType`\>(`jwt`): `PayloadType` & [`JWTPayload`](../interfaces/types.JWTPayload.md)

Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or
values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation
and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation
and JWE decryption use `jose.jwtDecrypt()`.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jwt/decode'`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PayloadType` | [`JWTPayload`](../interfaces/types.JWTPayload.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` | JWT token in compact JWS serialization. |

#### Returns

`PayloadType` & [`JWTPayload`](../interfaces/types.JWTPayload.md)

**`Example`**

```js
const claims = jose.decodeJwt(token)
console.log(claims)
```
