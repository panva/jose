# Function: sdJwtReceive()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **sdJwtReceive**\<`PayloadType`\>(`sdJwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, `string`\>, `"protectedHeader"` \| `"unprotectedHeader"`\> & `object`\>

Verifies and processes a Compact serialized Issuer-provided SD-JWT for a Holder. The returned
credential always contains its `protectedHeader`. An SD-JWT+KB is rejected because the Holder,
not the Issuer, creates Key Binding JWTs.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, `string`\>, `"protectedHeader"` \| `"unprotectedHeader"`\> & `object`\>

### Example

```js
import { sdJwtReceive } from 'jose/sd-jwt'

const credential = await sdJwtReceive(sdJwt, issuerPublicKey, {
  issuer: 'https://issuer.example',
})

console.log(credential.payload)
console.log(credential.disclosures.map(({ path }) => path))

const presentation = await credential.present(['/given_name'])
```

## Call Signature

▸ **sdJwtReceive**\<`PayloadType`\>(`sdJwt`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, `string`\>, `"protectedHeader"` \| `"unprotectedHeader"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies and processes a Compact serialized Issuer-provided SD-JWT for a Holder. The returned
credential always contains its `protectedHeader`. An SD-JWT+KB is rejected because the Holder,
not the Issuer, creates Key Binding JWTs.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options?` | [`SDJWTReceiveOptions`](../interfaces/SDJWTReceiveOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTCredential`](../interfaces/SDJWTCredential.md)\<`PayloadType`, `string`\>, `"protectedHeader"` \| `"unprotectedHeader"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Example

```js
import { sdJwtReceive } from 'jose/sd-jwt'

const credential = await sdJwtReceive(sdJwt, issuerPublicKey, {
  issuer: 'https://issuer.example',
})

console.log(credential.payload)
console.log(credential.disclosures.map(({ path }) => path))

const presentation = await credential.present(['/given_name'])
```
