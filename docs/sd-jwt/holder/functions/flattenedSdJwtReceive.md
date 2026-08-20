# Function: flattenedSdJwtReceive()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **flattenedSdJwtReceive**\<`PayloadType`\>(`sdJwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`FlattenedSDJWT`](../../../types/interfaces/FlattenedSDJWT.md)\>\>

Verifies and processes a Flattened JWS JSON serialized Issuer-provided SD-JWT for a Holder.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`FlattenedSDJWT`](../../../types/interfaces/FlattenedSDJWT.md)\>\>

### Example

```js
import { flattenedSdJwtReceive } from 'jose/sd-jwt'

const credential = await flattenedSdJwtReceive(issued, issuerPublicKey)
const available = credential.disclosures.map(({ path }) => path)
const presentation = await credential.present(['/address/street'])
```

## Call Signature

▸ **flattenedSdJwtReceive**\<`PayloadType`, `KeyType`\>(`sdJwt`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`FlattenedSDJWT`](../../../types/interfaces/FlattenedSDJWT.md)\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Verifies and processes a Flattened JWS JSON serialized Issuer-provided SD-JWT for a Holder.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |
| `KeyType` *extends* [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | - |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md)\<`KeyType`\> |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`FlattenedSDJWT`](../../../types/interfaces/FlattenedSDJWT.md)\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

### Example

```js
import { flattenedSdJwtReceive } from 'jose/sd-jwt'

const credential = await flattenedSdJwtReceive(issued, issuerPublicKey)
const available = credential.disclosures.map(({ path }) => path)
const presentation = await credential.present(['/address/street'])
```

## Call Signature

▸ **flattenedSdJwtReceive**\<`PayloadType`\>(`sdJwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`FlattenedSDJWT`](../../../types/interfaces/FlattenedSDJWT.md)\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Verifies and processes a Flattened JWS JSON serialized Issuer-provided SD-JWT for a Holder.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) \| [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`FlattenedSDJWT`](../../../types/interfaces/FlattenedSDJWT.md)\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

### Example

```js
import { flattenedSdJwtReceive } from 'jose/sd-jwt'

const credential = await flattenedSdJwtReceive(issued, issuerPublicKey)
const available = credential.disclosures.map(({ path }) => path)
const presentation = await credential.present(['/address/street'])
```
