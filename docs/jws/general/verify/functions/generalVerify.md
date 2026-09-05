# Function: generalVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **generalVerify**(`jws`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralVerifyResult`](../../../../types/interfaces/GeneralVerifyResult.md)\>

Verifies a General JWS signature and decodes its payload.

This function is exported (as a named export) from the main `'jose'` module entry point as well
as from its subpath export `'jose/jws/general/verify'`.

> [!NOTE]\
> Returns payload and headers from the first signature that verifies successfully. Other entries'
> headers may be inspected to reject inconsistent use of the JWS Unencoded Payload Option, but are
> not included in the result. Rely only on the returned data.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jws` | [`GeneralJWSInput`](../../../../types/interfaces/GeneralJWSInput.md) | General JWS. |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Public key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`VerifyOptions`](../../../../types/interfaces/VerifyOptions.md) | JWS Verify options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralVerifyResult`](../../../../types/interfaces/GeneralVerifyResult.md)\>

### Example

```js
const jws = {
  payload: 'SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IHlvdXIgZG9vci4',
  signatures: [
    {
      signature:
        'FVVOXwj6kD3DqdfD9yYqfT2W9jv-Nop4kOehp_DeDGNB5dQNSPRvntBY6xH3uxlCxE8na9d_kyhYOcanpDJ0EA',
      protected: 'eyJhbGciOiJFUzI1NiJ9',
    },
  ],
}

const { payload, protectedHeader } = await jose.generalVerify(jws, publicKey)

console.log(protectedHeader)
console.log(new TextDecoder().decode(payload))
```

## Call Signature

▸ **generalVerify**\<`KeyType`\>(`jws`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralVerifyResult`](../../../../types/interfaces/GeneralVerifyResult.md) & [`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Verifies a General JWS signature and decodes its payload with a dynamically resolved key,
included in the result.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `KeyType` *extends* [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jws` | [`GeneralJWSInput`](../../../../types/interfaces/GeneralJWSInput.md) | General JWS. |
| `getKey` | [`GeneralVerifyGetKey`](../interfaces/GeneralVerifyGetKey.md)\<`KeyType`\> | Resolves a public key or shared secret from unverified token data. |
| `options?` | [`VerifyOptions`](../../../../types/interfaces/VerifyOptions.md) | JWS Verify options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralVerifyResult`](../../../../types/interfaces/GeneralVerifyResult.md) & [`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

## Call Signature

▸ **generalVerify**(`jws`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralVerifyResult`](../../../../types/interfaces/GeneralVerifyResult.md) & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Verifies a General JWS and decodes its payload using a key or key resolver. The result includes
`key` only when a resolver is used.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jws` | [`GeneralJWSInput`](../../../../types/interfaces/GeneralJWSInput.md) | General JWS. |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) \| [`GeneralVerifyGetKey`](../interfaces/GeneralVerifyGetKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> | Public key or shared secret, or a function resolving one. |
| `options?` | [`VerifyOptions`](../../../../types/interfaces/VerifyOptions.md) | JWS Verify options. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralVerifyResult`](../../../../types/interfaces/GeneralVerifyResult.md) & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>
