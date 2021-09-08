# Function: jwtVerify

[jwt/verify](../modules/jwt_verify.md).jwtVerify

▸ **jwtVerify**(`jwt`, `key`, `options?`): `Promise`<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md)\>

Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the JWT Claims Set.

**`example`** ESM import
```js
import { jwtVerify } from 'jose/jwt/verify'
```

**`example`** CJS import
```js
const { jwtVerify } = require('jose/jwt/verify')
```

**`example`** Deno import
```js
import { jwtVerify } from 'https://deno.land/x/jose@v3.16.1/jwt/verify.ts'
```

**`example`** Usage
```js
const jwt = 'eyJhbGciOiJFUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjA0MzE1MDc0LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.hx1nOfAT5LlXuzu8O-bhjXBGpklWDt2EsHw7-MDn49NrnwvVsstNhEnkW2ddauB7eSikFtUNeumLpFI9CWDBsg'

const { payload, protectedHeader } = await jwtVerify(jwt, publicKey, {
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
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| [`JWTVerifyGetKey`](../interfaces/jwt_verify.JWTVerifyGetKey.md) | Key, or a function resolving a key, to verify the JWT with. |
| `options?` | [`JWTVerifyOptions`](../interfaces/jwt_verify.JWTVerifyOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

`Promise`<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md)\>

#### Defined in

[jwt/verify.ts:64](https://github.com/panva/jose/blob/v3.16.1/src/jwt/verify.ts#L64)
