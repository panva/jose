# Function: jwtVerify

▸ **jwtVerify**(`jwt`: string \| Uint8Array, `key`: [KeyLike](../types/_types_d_.keylike.md) \| [JWTVerifyGetKey](../interfaces/_jwt_verify_.jwtverifygetkey.md), `options?`: [JWTVerifyOptions](../interfaces/_jwt_verify_.jwtverifyoptions.md)): Promise\<[JWTVerifyResult](../interfaces/_types_d_.jwtverifyresult.md)>

*Defined in [src/jwt/verify.ts:66](https://github.com/panva/jose/blob/v3.1.0/src/jwt/verify.ts#L66)*

Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the JWT Claims Set.

**`example`** 
```js
// ESM import
import jwtVerify from 'jose/jwt/verify'
```

**`example`** 
```js
// CJS import
const { default: jwtVerify } = require('jose/jwt/verify')
```

**`example`** 
```js
// usage
import parseJwk from 'jose/jwk/parse'

const jwt = 'eyJhbGciOiJFUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjA0MzE1MDc0LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.hx1nOfAT5LlXuzu8O-bhjXBGpklWDt2EsHw7-MDn49NrnwvVsstNhEnkW2ddauB7eSikFtUNeumLpFI9CWDBsg'
const publicKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})
const { payload, protectedHeader } = await jwtVerify(jwt, publicKey, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(protectedHeader)
console.log(payload)
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`jwt` | string \| Uint8Array | JSON Web Token value (encoded as JWS). |
`key` | [KeyLike](../types/_types_d_.keylike.md) \| [JWTVerifyGetKey](../interfaces/_jwt_verify_.jwtverifygetkey.md) | Key, or a function resolving a key, to verify the JWT with. |
`options?` | [JWTVerifyOptions](../interfaces/_jwt_verify_.jwtverifyoptions.md) | JWT Decryption and JWT Claims Set validation options.  |

**Returns:** Promise\<[JWTVerifyResult](../interfaces/_types_d_.jwtverifyresult.md)>
