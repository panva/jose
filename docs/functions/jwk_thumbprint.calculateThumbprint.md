# Function: calculateThumbprint

[jwk/thumbprint](../modules/jwk_thumbprint.md).calculateThumbprint

▸ **calculateThumbprint**(`jwk`, `digestAlgorithm?`): `Promise`<`string`\>

Calculates a base64url-encoded JSON Web Key (JWK) Thumbprint as per
[RFC7638](https://tools.ietf.org/html/rfc7638).

**`example`** ESM import
```js
import { calculateThumbprint } from 'jose/jwk/thumbprint'
```

**`example`** CJS import
```js
const { calculateThumbprint } = require('jose/jwk/thumbprint')
```

**`example`** Deno import
```js
import { calculateThumbprint } from 'https://deno.land/x/jose@v3.15.0/jwk/thumbprint.ts'
```

**`example`** Usage
```js
const thumbprint = await calculateThumbprint({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
})

console.log(thumbprint)
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `jwk` | [`JWK`](../interfaces/types.JWK.md) | `undefined` | JSON Web Key. |
| `digestAlgorithm` | ``"sha256"`` \| ``"sha384"`` \| ``"sha512"`` | `'sha256'` | Digest Algorithm to use for calculating the thumbprint. Default is sha256. Accepted is "sha256", "sha384", "sha512". |

#### Returns

`Promise`<`string`\>

#### Defined in

[jwk/thumbprint.ts:49](https://github.com/panva/jose/blob/v3.15.0/src/jwk/thumbprint.ts#L49)
