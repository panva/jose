# Function: sdJwtVerify()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Call Signature

▸ **sdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\>\>

Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
property. These policy-specific result shapes are reflected by the TypeScript overloads.

This function is exported from the `'jose/sd-jwt'` subpath.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\>\>

### Examples

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Require and verify Key Binding
const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: {
    audience: 'https://verifier.example',
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Forbid Key Binding
const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: false,
})
```

## Call Signature

▸ **sdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object`\>

Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
property. These policy-specific result shapes are reflected by the TypeScript overloads.

This function is exported from the `'jose/sd-jwt'` subpath.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object`\>

### Examples

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Require and verify Key Binding
const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: {
    audience: 'https://verifier.example',
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Forbid Key Binding
const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: false,
})
```

## Call Signature

▸ **sdJwtVerify**\<`PayloadType`\>(`sdJwt`, `key`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>\>

Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
property. These policy-specific result shapes are reflected by the TypeScript overloads.

This function is exported from the `'jose/sd-jwt'` subpath.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `key` | [`SDJWTIssuerKey`](../../../types/type-aliases/SDJWTIssuerKey.md) |
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>\>

### Examples

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Require and verify Key Binding
const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: {
    audience: 'https://verifier.example',
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Forbid Key Binding
const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: false,
})
```

## Call Signature

▸ **sdJwtVerify**\<`PayloadType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
property. These policy-specific result shapes are reflected by the TypeScript overloads.

This function is exported from the `'jose/sd-jwt'` subpath.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Examples

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Require and verify Key Binding
const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: {
    audience: 'https://verifier.example',
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Forbid Key Binding
const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: false,
})
```

## Call Signature

▸ **sdJwtVerify**\<`PayloadType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
property. These policy-specific result shapes are reflected by the TypeScript overloads.

This function is exported from the `'jose/sd-jwt'` subpath.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options` | [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md), `"keyBinding"`\> & `object` |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\>, `"keyBinding"`\> & `object` & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Examples

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Require and verify Key Binding
const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: {
    audience: 'https://verifier.example',
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Forbid Key Binding
const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: false,
})
```

## Call Signature

▸ **sdJwtVerify**\<`PayloadType`\>(`sdJwt`, `getKey`, `options`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

Verifies a Compact serialized SD-JWT presentation. Its `protectedHeader` result is always
present. Passing `keyBinding: false` rejects a KB-JWT and returns no `keyBinding` property;
passing a policy object requires and validates a KB-JWT and returns a required `keyBinding`
property. These policy-specific result shapes are reflected by the TypeScript overloads.

This function is exported from the `'jose/sd-jwt'` subpath.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `sdJwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
| `getKey` | [`SDJWTIssuerGetKey`](../../../types/interfaces/SDJWTIssuerGetKey.md) |
| `options` | [`SDJWTVerifyOptions`](../interfaces/SDJWTVerifyOptions.md) |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTVerifyResult`](../interfaces/SDJWTVerifyResult.md)\<`PayloadType`\> & [`ResolvedKey`](../../../types/interfaces/ResolvedKey.md)\>

### Examples

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Require and verify Key Binding
const { payload, keyBinding } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: {
    audience: 'https://verifier.example',
    nonce,
    algorithms: ['ES256'],
    maxTokenAge: '5 minutes',
  },
})
```

```js
import { sdJwtVerify } from 'jose/sd-jwt'

// Forbid Key Binding
const { payload } = await sdJwtVerify(presentation, issuerPublicKey, {
  issuer: 'https://issuer.example',
  algorithms: ['ES256'],
  keyBinding: false,
})
```
