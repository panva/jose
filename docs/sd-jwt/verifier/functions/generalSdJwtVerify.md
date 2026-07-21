# Function: generalSdJwtVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **generalSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\>\>

Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads. The returned headers belong to the first signature that
verifies successfully.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\>\>

### Example

```js
import { generalSdJwtVerify } from 'jose/sd-jwt'

const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
  algorithms: ['ES256'],
  keyBinding: {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

## Call Signature

▸ **generalSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object`\>

Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads. The returned headers belong to the first signature that
verifies successfully.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object`\>

### Example

```js
import { generalSdJwtVerify } from 'jose/sd-jwt'

const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
  algorithms: ['ES256'],
  keyBinding: {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

## Call Signature

▸ **generalSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>\>

Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads. The returned headers belong to the first signature that
verifies successfully.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>\>

### Example

```js
import { generalSdJwtVerify } from 'jose/sd-jwt'

const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
  algorithms: ['ES256'],
  keyBinding: {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

## Call Signature

▸ **generalSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads. The returned headers belong to the first signature that
verifies successfully.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Example

```js
import { generalSdJwtVerify } from 'jose/sd-jwt'

const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
  algorithms: ['ES256'],
  keyBinding: {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

## Call Signature

▸ **generalSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads. The returned headers belong to the first signature that
verifies successfully.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Example

```js
import { generalSdJwtVerify } from 'jose/sd-jwt'

const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
  algorithms: ['ES256'],
  keyBinding: {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

## Call Signature

▸ **generalSdJwtVerify**\<`PayloadType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies a General JWS JSON serialized SD-JWT presentation. Passing `keyBinding: false` rejects a
KB-JWT and returns no `keyBinding` property; passing a policy object requires and validates a
KB-JWT and returns a required `keyBinding` property. These policy-specific result shapes are
reflected by the TypeScript overloads. The returned headers belong to the first signature that
verifies successfully.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | [`GeneralJWS`](../../../types/interfaces/GeneralJWS.md) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWTVerifyResult`](../interfaces/GeneralSDJWTVerifyResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Example

```js
import { generalSdJwtVerify } from 'jose/sd-jwt'

const { payload, keyBinding } = await generalSdJwtVerify(presentation, issuerPublicKey, {
  algorithms: ['ES256'],
  keyBinding: {
    audience,
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```
