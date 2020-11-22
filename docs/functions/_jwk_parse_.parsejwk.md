# Function: parseJwk

▸ **parseJwk**(`jwk`: [JWK](../interfaces/_types_d_.jwk.md), `alg?`: string, `octAsKeyObject?`: false \| true): Promise\<[KeyLike](../types/_types_d_.keylike.md)>

*Defined in [src/jwk/parse.ts:50](https://github.com/panva/jose/blob/v3.1.0/src/jwk/parse.ts#L50)*

Converts a JWK to a runtime-specific key representation (KeyLike). Either
JWK "alg" (Algorithm) Parameter must be present or the optional "alg" argument. When
running on a platform using [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
the jwk parameters "use", "key_ops", and "ext" are also used in the resulting `CryptoKey`.

**`example`** 
```js
// ESM import
import parseJwk from 'jose/jwk/parse'
```

**`example`** 
```js
// CJS import
const { default: parseJwk } = require('jose/jwk/parse')
```

**`example`** 
```js
// usage
const ecPrivateKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})

const rsaPublicKey = await parseJwk({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
}, 'PS256')
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`jwk` | [JWK](../interfaces/_types_d_.jwk.md) | JSON Web Key. |
`alg?` | string | JSON Web Algorithm identifier to be used with the converted key. Default is the "alg" property on the JWK. |
`octAsKeyObject?` | false \| true | Forces a symmetric key to be converted to a KeyObject or CryptoKey. Default is true unless JWK "ext" (Extractable) is true.  |

**Returns:** Promise\<[KeyLike](../types/_types_d_.keylike.md)>
