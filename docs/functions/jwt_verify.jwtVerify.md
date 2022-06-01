# Function: jwtVerify

[💗 Help the project](https://github.com/sponsors/panva)

▸ **jwtVerify**(`jwt`, `key`, `options?`): `Promise`<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md)\>

Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the JWT Claims Set.

**`example`** Usage
```js
const jwt = 'eyJhbGciOiJFUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjA0MzE1MDc0LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.hx1nOfAT5LlXuzu8O-bhjXBGpklWDt2EsHw7-MDn49NrnwvVsstNhEnkW2ddauB7eSikFtUNeumLpFI9CWDBsg'

const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(protectedHeader)
console.log(payload)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| `Uint8Array` | JSON Web Token value (encoded as JWS). |
| `key` | `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) | Key to verify the JWT with. |
| `options?` | [`JWTVerifyOptions`](../interfaces/jwt_verify.JWTVerifyOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

`Promise`<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md)\>

▸ **jwtVerify**(`jwt`, `getKey`, `options?`): `Promise`<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| `Uint8Array` | JSON Web Token value (encoded as JWS). |
| `getKey` | [`JWTVerifyGetKey`](../interfaces/jwt_verify.JWTVerifyGetKey.md) | Function resolving a key to verify the JWT with. |
| `options?` | [`JWTVerifyOptions`](../interfaces/jwt_verify.JWTVerifyOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

`Promise`<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
