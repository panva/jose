# Function: calculateJwkThumbprint

[💗 Help the project](https://github.com/sponsors/panva)

▸ **calculateJwkThumbprint**(`jwk`, `digestAlgorithm?`): `Promise`<`string`\>

Calculates a base64url-encoded JSON Web Key (JWK) Thumbprint as per
[RFC7638](https://www.rfc-editor.org/rfc/rfc7638).

**`example`** Usage

```js
const thumbprint = await jose.calculateJwkThumbprint({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
})

console.log(thumbprint)
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `jwk` | [`JWK`](../interfaces/types.JWK.md) | `undefined` | JSON Web Key. |
| `digestAlgorithm` | ``"sha256"`` \| ``"sha384"`` \| ``"sha512"`` | `'sha256'` | Digest Algorithm to use for calculating the thumbprint. Default is sha256.   Accepted is "sha256", "sha384", "sha512". |

#### Returns

`Promise`<`string`\>
