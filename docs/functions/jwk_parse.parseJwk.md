# Function: parseJwk

[jwk/parse](../modules/jwk_parse.md).parseJwk

▸ **parseJwk**(`jwk`, `alg?`, `octAsKeyObject?`): `Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

Converts a JWK to a runtime-specific key representation (KeyLike). Either
JWK "alg" (Algorithm) Parameter must be present or the optional "alg" argument. When
running on a platform using [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
the jwk parameters "use", "key_ops", and "ext" are also used in the resulting `CryptoKey`.

**`example`** ESM import
```js
import { parseJwk } from 'jose/jwk/parse'
```

**`example`** CJS import
```js
const { parseJwk } = require('jose/jwk/parse')
```

**`example`** Deno import
```js
import { parseJwk } from 'https://deno.land/x/jose@v3.15.4/jwk/parse.ts'
```

**`example`** Usage
```js
const ecPublicKey = await parseJwk({
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
}, 'ES256')

const rsaPublicKey = await parseJwk({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
}, 'PS256')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwk` | [`JWK`](../interfaces/types.JWK.md) | JSON Web Key. |
| `alg?` | `string` | JSON Web Algorithm identifier to be used with the converted key. Default is the "alg" property on the JWK. |
| `octAsKeyObject?` | `boolean` | Forces a symmetric key to be converted to a KeyObject or CryptoKey. Default is true unless JWK "ext" (Extractable) is true. |

#### Returns

`Promise`<[`KeyLike`](../types/types.KeyLike.md)\>

#### Defined in

[jwk/parse.ts:50](https://github.com/panva/jose/blob/v3.15.4/src/jwk/parse.ts#L50)
