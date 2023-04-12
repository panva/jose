# Function: jwtVerify

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

▸ **jwtVerify**(`jwt`, `key`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md)\>

Verifies the JWT format (to be a JWS Compact format), verifies the JWS signature, validates the
JWT Claims Set.

**`example`** Usage with a symmetric secret

```js
const secret = new TextEncoder().encode(
  'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
)
const jwt =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjY5MDU2MjMxLCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.C4iSlLfAUMBq--wnC6VqD9gEOhwpRZpoRarE0m7KEnI'

const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(protectedHeader)
console.log(payload)
```

**`example`** Usage with a public SPKI encoded RSA key

```js
const alg = 'RS256'
const spki = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwhYOFK2Ocbbpb/zVypi9
SeKiNUqKQH0zTKN1+6fpCTu6ZalGI82s7XK3tan4dJt90ptUPKD2zvxqTzFNfx4H
HHsrYCf2+FMLn1VTJfQazA2BvJqAwcpW1bqRUEty8tS/Yv4hRvWfQPcc2Gc3+/fQ
OOW57zVy+rNoJc744kb30NjQxdGp03J2S3GLQu7oKtSDDPooQHD38PEMNnITf0pj
+KgDPjymkMGoJlO3aKppsjfbt/AH6GGdRghYRLOUwQU+h+ofWHR3lbYiKtXPn5dN
24kiHy61e3VAQ9/YAZlwXC/99GGtw/NpghFAuM4P1JDn0DppJldy3PGFC0GfBCZA
SwIDAQAB
-----END PUBLIC KEY-----`
const publicKey = await jose.importSPKI(spki, alg)
const jwt =
  'eyJhbGciOiJSUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjY5MDU2NDg4LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.gXrPZ3yM_60dMXGE69dusbpzYASNA-XIOwsb5D5xYnSxyj6_D6OR_uR_1vqhUm4AxZxcrH1_-XJAve9HCw8az_QzHcN-nETt-v6stCsYrn6Bv1YOc-mSJRZ8ll57KVqLbCIbjKwerNX5r2_Qg2TwmJzQdRs-AQDhy-s_DlJd8ql6wR4n-kDZpar-pwIvz4fFIN0Fj57SXpAbLrV6Eo4Byzl0xFD8qEYEpBwjrMMfxCZXTlAVhAq6KCoGlDTwWuExps342-0UErEtyIqDnDGcrfNWiUsoo8j-29IpKd-w9-C388u-ChCxoHz--H8WmMSZzx3zTXsZ5lXLZ9IKfanDKg'

const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(protectedHeader)
console.log(payload)
```

**`example`** Usage with a public JWK encoded RSA key

```js
const alg = 'RS256'
const jwk = {
  kty: 'RSA',
  n: 'whYOFK2Ocbbpb_zVypi9SeKiNUqKQH0zTKN1-6fpCTu6ZalGI82s7XK3tan4dJt90ptUPKD2zvxqTzFNfx4HHHsrYCf2-FMLn1VTJfQazA2BvJqAwcpW1bqRUEty8tS_Yv4hRvWfQPcc2Gc3-_fQOOW57zVy-rNoJc744kb30NjQxdGp03J2S3GLQu7oKtSDDPooQHD38PEMNnITf0pj-KgDPjymkMGoJlO3aKppsjfbt_AH6GGdRghYRLOUwQU-h-ofWHR3lbYiKtXPn5dN24kiHy61e3VAQ9_YAZlwXC_99GGtw_NpghFAuM4P1JDn0DppJldy3PGFC0GfBCZASw',
  e: 'AQAB',
}
const publicKey = await jose.importJWK(jwk, alg)
const jwt =
  'eyJhbGciOiJSUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZSwiaWF0IjoxNjY5MDU2NDg4LCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9.gXrPZ3yM_60dMXGE69dusbpzYASNA-XIOwsb5D5xYnSxyj6_D6OR_uR_1vqhUm4AxZxcrH1_-XJAve9HCw8az_QzHcN-nETt-v6stCsYrn6Bv1YOc-mSJRZ8ll57KVqLbCIbjKwerNX5r2_Qg2TwmJzQdRs-AQDhy-s_DlJd8ql6wR4n-kDZpar-pwIvz4fFIN0Fj57SXpAbLrV6Eo4Byzl0xFD8qEYEpBwjrMMfxCZXTlAVhAq6KCoGlDTwWuExps342-0UErEtyIqDnDGcrfNWiUsoo8j-29IpKd-w9-C388u-ChCxoHz--H8WmMSZzx3zTXsZ5lXLZ9IKfanDKg'

const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(protectedHeader)
console.log(payload)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | JSON Web Token value (encoded as JWS). |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Key to verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`JWTVerifyOptions`](../interfaces/jwt_verify.JWTVerifyOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md)\>

▸ **jwtVerify**<`T`\>(`jwt`, `getKey`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`T`\>\>

**`example`** Usage with a public JSON Web Key Set hosted on a remote URL

```js
const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})
console.log(protectedHeader)
console.log(payload)
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | JSON Web Token value (encoded as JWS). |
| `getKey` | [`JWTVerifyGetKey`](../interfaces/jwt_verify.JWTVerifyGetKey.md) | Function resolving a key to verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`JWTVerifyOptions`](../interfaces/jwt_verify.JWTVerifyOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTVerifyResult`](../interfaces/types.JWTVerifyResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`T`\>\>
