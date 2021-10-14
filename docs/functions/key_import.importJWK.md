# Function: importJWK

▸ **importJWK**(`jwk`, `alg?`, `octAsKeyObject?`): `Promise`<[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array`\>

Imports a JWK to a runtime-specific key representation (KeyLike). Either
JWK "alg" (Algorithm) Parameter must be present or the optional "alg" argument. When
running on a runtime using [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
the jwk parameters "use", "key_ops", and "ext" are also used in the resulting `CryptoKey`.
See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210) to learn about key to algorithm
requirements and mapping.

**`example`** ESM import
```js
import { importJWK } from 'jose/key/import'
```

**`example`** CJS import
```js
const { importJWK } = require('jose/key/import')
```

**`example`** Deno import
```js
import { importJWK } from 'https://deno.land/x/jose@v3.20.2/key/import.ts'
```

**`example`** Usage
```js
const ecPublicKey = await importJWK({
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
}, 'ES256')

const rsaPublicKey = await importJWK({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
}, 'PS256')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwk` | [`JWK`](../interfaces/types.JWK.md) | JSON Web Key. |
| `alg?` | `string` | JSON Web Algorithm identifier to be used with the imported key. Default is the "alg" property on the JWK. |
| `octAsKeyObject?` | `boolean` | Forces a symmetric key to be imported to a KeyObject or CryptoKey. Default is true unless JWK "ext" (Extractable) is true. |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array`\>
