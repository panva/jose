# Function: generalSdJwtReceive()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **generalSdJwtReceive**\<`PayloadType`\>(`sdJwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\>\>

Verifies and processes a General JWS JSON serialized Issuer-provided SD-JWT for a Holder.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\>\>

### Example

```js
import { generalSdJwtReceive } from 'jose/sd-jwt'

const credential = await generalSdJwtReceive(issued, issuerPublicKey)
const presentation = await credential
  .addKeyBinding(holderPrivateKey)
  .setProtectedHeader({ alg: 'ES256' })
  .setAudience(audience)
  .setNonce(nonce)
  .setIssuedAt()
  .present(['/given_name'])
```

## Call Signature

▸ **generalSdJwtReceive**\<`PayloadType`\>(`sdJwt`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies and processes a General JWS JSON serialized Issuer-provided SD-JWT for a Holder.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, [`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Example

```js
import { generalSdJwtReceive } from 'jose/sd-jwt'

const credential = await generalSdJwtReceive(issued, issuerPublicKey)
const presentation = await credential
  .addKeyBinding(holderPrivateKey)
  .setProtectedHeader({ alg: 'ES256' })
  .setAudience(audience)
  .setNonce(nonce)
  .setIssuedAt()
  .present(['/given_name'])
```
