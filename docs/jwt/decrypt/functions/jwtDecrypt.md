# Function: jwtDecrypt()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **jwtDecrypt**\<`PayloadType`\>(`jwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>\>

Decrypts a Compact JWE-formatted JWT and validates its Claims Set.

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
| `key` | [`KeyInput`](../../../types/type-aliases/KeyInput.md) | Private key or shared secret to decrypt and verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`JWTDecryptOptions`](../interfaces/JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

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

▸ **jwtDecrypt**\<`PayloadType`, `KeyType`\>(`jwt`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Decrypts a JWT and validates its claims, returning the dynamically
[resolved key](../../../types/interfaces/ResolvedKey.md#key).

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |
| `KeyType` *extends* [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JSON Web Token value (encoded as JWE). |
| `getKey` | [`JWTDecryptGetKey`](../interfaces/JWTDecryptGetKey.md)\<`KeyType`\> | Function resolving a private key or shared secret to decrypt and verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`JWTDecryptOptions`](../interfaces/JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

## Call Signature

▸ **jwtDecrypt**\<`PayloadType`\>(`jwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Accepts a key or key resolver. Use this overload when forwarding either form; the result includes
`key` only when a resolver was used.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JSON Web Token value (encoded as JWE). |
| `key` | [`KeyInput`](../../../types/type-aliases/KeyInput.md) \| [`JWTDecryptGetKey`](../interfaces/JWTDecryptGetKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> | Private key or shared secret, or a function resolving one, to decrypt and verify the JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg). |
| `options?` | [`JWTDecryptOptions`](../interfaces/JWTDecryptOptions.md) | JWT Decryption and JWT Claims Set validation options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTDecryptResult`](../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>
