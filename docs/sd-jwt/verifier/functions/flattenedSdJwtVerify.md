# Function: flattenedSdJwtVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object`\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object`\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`, `KeyType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

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
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`, `KeyType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

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
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`, `KeyType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

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
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) \| [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) \| [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```

## Call Signature

▸ **flattenedSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Verifies a Flattened JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects
a KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads.

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`FlattenedJWS`](../../../types/interfaces/FlattenedJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) \| [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> |
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedSDJWTVerifyResult`](../interfaces/FlattenedSDJWTVerifyResult.md)\<`PayloadType`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\<[`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

### Example

```js
import { flattenedSdJwtVerify } from 'jose/sd-jwt'

const { payload, protectedHeader, unprotectedHeader } = await flattenedSdJwtVerify(
  presentation,
  issuerPublicKey,
  {
    issuer: 'https://issuer.example',
    algorithms: ['ES256'],
    keyBinding: false,
  },
)
```
