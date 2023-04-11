# Function: jwtDecrypt

[💗 Help the project](https://github.com/sponsors/panva)

▸ **jwtDecrypt**(`jwt`, `key`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md)\>

Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT
Claims Set.

**`example`** Usage

```js
const secret = jose.base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
const jwt =
  'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..MB66qstZBPxAXKdsjet_lA.WHbtJTl4taHp7otOHLq3hBvv0yNPsPEKHYInmCPdDDeyV1kU-f-tGEiU4FxlSqkqAT2hVs8_wMNiQFAzPU1PUgIqWCPsBrPP3TtxYsrtwagpn4SvCsUsx0Mhw9ZhliAO8CLmCBQkqr_T9AcYsz5uZw.7nX9m7BGUu_u1p1qFHzyIg'

const { payload, protectedHeader } = await jose.jwtDecrypt(jwt, secret, {
  issuer: 'urn:example:issuer',
  audience: 'urn:example:audience',
})

console.log(protectedHeader)
console.log(payload)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | JSON Web Token value (encoded as JWE). |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to decrypt and verify the JWT with. |
| `options?` | [`JWTDecryptOptions`](../interfaces/jwt_decrypt.JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md)\>

▸ **jwtDecrypt**<`T`\>(`jwt`, `getKey`, `options?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KeyLike`](../types/types.KeyLike.md) = [`KeyLike`](../types/types.KeyLike.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jwt` | `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | JSON Web Token value (encoded as JWE). |
| `getKey` | [`JWTDecryptGetKey`](../interfaces/jwt_decrypt.JWTDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt and verify the JWT with. |
| `options?` | [`JWTDecryptOptions`](../interfaces/jwt_decrypt.JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`JWTDecryptResult`](../interfaces/types.JWTDecryptResult.md) & [`ResolvedKey`](../interfaces/types.ResolvedKey.md)<`T`\>\>
