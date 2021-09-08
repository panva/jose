# Function: jwtDecrypt

[jwt/decrypt](../modules/jwt_decrypt.md).jwtDecrypt

▸ **jwtDecrypt**(`jwt`, `key`, `options?`): `Promise`<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md)\>

Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT Claims Set.

**`example`** ESM import
```js
import { jwtDecrypt } from 'jose/jwt/decrypt'
```

**`example`** CJS import
```js
const { jwtDecrypt } = require('jose/jwt/decrypt')
```

**`example`** Deno import
```js
import { jwtDecrypt } from 'https://deno.land/x/jose@v3.16.1/jwt/decrypt.ts'
```

**`example`** Usage
```js
const jwt = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..KVcNLqK-3-8ZkYIC.xSwF4VxO0kUMUD2W-cifsNUxnr-swyBq-nADBptyt6y9n79-iNc5b0AALJpRwc0wwDkJw8hNOMjApNUTMsK9b-asToZ3DXFMvwfJ6n1aWefvd7RsoZ2LInWFfVAuttJDzoGB.uuexQoWHwrLMEYRElT8pBQ'

const { payload, protectedHeader } = await jwtDecrypt(jwt, secretKey, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience'
})

console.log(protectedHeader)
console.log(payload)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| `Uint8Array` | JSON Web Token value (encoded as JWE). |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| [`JWTDecryptGetKey`](../interfaces/jwt_decrypt.JWTDecryptGetKey.md) | Private Key or Secret, or a function resolving one, to decrypt and verify the JWT with. |
| `options?` | [`JWTDecryptOptions`](../interfaces/jwt_decrypt.JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

`Promise`<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md)\>

#### Defined in

[jwt/decrypt.ts:61](https://github.com/panva/jose/blob/v3.16.1/src/jwt/decrypt.ts#L61)
