# Interface: ComposedJWTDecryptFunction()\<Factories\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A JWT decryptor restricted to the selected JWE algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |

## Call Signature

▸ **ComposedJWTDecryptFunction**\<`PayloadType`\>(`jwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`ComposedJWTDecryptResult`](../type-aliases/ComposedJWTDecryptResult.md)\<`Factories`, `PayloadType`\>\>

A JWT decryptor restricted to the selected JWE algorithms.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWT to process. |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`ComposedJWTDecryptOptions`](../type-aliases/ComposedJWTDecryptOptions.md)\<`Factories`\> | Options for verification or decryption, including JWT Claims Set validation. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`ComposedJWTDecryptResult`](../type-aliases/ComposedJWTDecryptResult.md)\<`Factories`, `PayloadType`\>\>

## Call Signature

▸ **ComposedJWTDecryptFunction**\<`PayloadType`, `KeyType`\>(`jwt`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTDecryptResult`](../../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

A JWT decryptor restricted to the selected JWE algorithms.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |
| `KeyType` *extends* [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWT to process. |
| `getKey` | [`ComposedJWTDecryptGetKey`](ComposedJWTDecryptGetKey.md)\<`Factories`, `KeyType`\> | Function resolving a Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`ComposedJWTDecryptOptions`](../type-aliases/ComposedJWTDecryptOptions.md)\<`Factories`\> | Options for verification or decryption, including JWT Claims Set validation. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTDecryptResult`](../../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

## Call Signature

▸ **ComposedJWTDecryptFunction**\<`PayloadType`\>(`jwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTDecryptResult`](../../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

A JWT decryptor restricted to the selected JWE algorithms.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWT to process. |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) \| [`ComposedJWTDecryptGetKey`](ComposedJWTDecryptGetKey.md)\<`Factories`, [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\> | Key, Secret, or function resolving one, for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`ComposedJWTDecryptOptions`](../type-aliases/ComposedJWTDecryptOptions.md)\<`Factories`\> | Options for verification or decryption, including JWT Claims Set validation. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTDecryptResult`](../../../../types/interfaces/JWTDecryptResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>
