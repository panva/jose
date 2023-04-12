# Function: decodeJwt

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **decodeJwt**(`jwt`): [`JWTPayload`](../interfaces/types.JWTPayload.md)

Decodes a signed JSON Web Token payload. This does not validate the JWT Claims Set types or
values. This does not validate the JWS Signature. For a proper Signed JWT Claims Set validation
and JWS signature verification use `jose.jwtVerify()`. For an encrypted JWT Claims Set validation
and JWE decryption use `jose.jwtDecrypt()`.

**`example`** Usage

```js
const claims = jose.decodeJwt(token)
console.log(claims)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` | JWT token in compact JWS serialization. |

#### Returns

[`JWTPayload`](../interfaces/types.JWTPayload.md)
