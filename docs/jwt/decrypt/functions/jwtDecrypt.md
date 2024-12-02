# Function: jwtDecrypt()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **jwtDecrypt**\<`PayloadType`\>(`jwt`, `key`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>\>

Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT
Claims Set.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jwt/decrypt'`.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JSON Web Token value (encoded as JWE). |
| `key` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../../../types/type-aliases/KeyLike.md) | Private Key or Secret to decrypt and verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options`? | [`JWTDecryptOptions`](../interfaces/JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>\>

### Example

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

## Call Signature

▸ **jwtDecrypt**\<`PayloadType`, `KeyLikeType`\>(`jwt`, `getKey`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyLikeType`\>\>

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |
| `KeyLikeType` *extends* [`KeyLike`](../../../types/type-aliases/KeyLike.md) | [`KeyLike`](../../../types/type-aliases/KeyLike.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JSON Web Token value (encoded as JWE). |
| `getKey` | [`JWTDecryptGetKey`](../interfaces/JWTDecryptGetKey.md) | Function resolving Private Key or Secret to decrypt and verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options`? | [`JWTDecryptOptions`](../interfaces/JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyLikeType`\>\>
