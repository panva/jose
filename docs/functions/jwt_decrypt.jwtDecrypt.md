# Function: jwtDecrypt

▸ **jwtDecrypt**(`jwt`, `key`, `options?`): `Promise`<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md)\>

Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT Claims Set.

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

**`example`** ESM import
```js
import { jwtDecrypt } from 'jose'
```

**`example`** CJS import
```js
const { jwtDecrypt } = require('jose')
```

**`example`** Deno import
```js
import { jwtDecrypt } from 'https://deno.land/x/jose@v4.0.4/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| `Uint8Array` | JSON Web Token value (encoded as JWE). |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to decrypt and verify the JWT with. |
| `options?` | [`JWTDecryptOptions`](../interfaces/jwt_decrypt.JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

`Promise`<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md)\>

▸ **jwtDecrypt**(`jwt`, `getKey`, `options?`): `Promise`<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| `Uint8Array` | JSON Web Token value (encoded as JWE). |
| `getKey` | [`JWTDecryptGetKey`](../interfaces/jwt_decrypt.JWTDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt and verify the JWT with. |
| `options?` | [`JWTDecryptOptions`](../interfaces/jwt_decrypt.JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

`Promise`<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)\>
