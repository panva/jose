# Function: importJWK

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **importJWK**\<`KeyLikeType`\>(`jwk`, `alg?`): [`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType` \| [`Uint8Array`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )\>

Imports a JWK to a runtime-specific key representation (KeyLike). Either JWK "alg" (Algorithm)
Parameter must be present or the optional "alg" argument. When running on a runtime using
[Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/) the jwk parameters "use",
"key_ops", and "ext" are also used in the resulting `CryptoKey`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `KeyLikeType` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwk` | [`JWK`](../interfaces/types.JWK.md) | JSON Web Key. |
| `alg?` | `string` | (Only effective in Web Crypto API runtimes) JSON Web Algorithm identifier to be used with the imported key. Default is the "alg" property on the JWK, its presence is only enforced in Web Crypto API runtimes. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |

#### Returns

[`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<`KeyLikeType` \| [`Uint8Array`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )\>

**`Example`**

```js
const ecPublicKey = await jose.importJWK(
  {
    crv: 'P-256',
    kty: 'EC',
    x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
    y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo',
  },
  'ES256',
)

const rsaPublicKey = await jose.importJWK(
  {
    kty: 'RSA',
    e: 'AQAB',
    n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
  },
  'PS256',
)
```
