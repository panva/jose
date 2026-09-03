# Interface: JWTVerifyFunction()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Callable JWT verifier restricted at runtime to the selected JWS algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Call Signature

▸ **JWTVerifyFunction**\<`PayloadType`\>(`jwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTVerifyResult`](../type-aliases/JWTVerifyResult.md)\<`PayloadType`, `Algorithm`\>\>

Callable JWT verifier restricted at runtime to the selected JWS algorithms.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWT to process. |
| `key` | [`JWSKeyInput`](../../../../algorithms/jws/type-aliases/JWSKeyInput.md)\<`Algorithm`\> | Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`JWTVerifyOptions`](../type-aliases/JWTVerifyOptions.md)\<`Algorithm`\> | Options for verification or decryption, including JWT Claims Set validation. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`JWTVerifyResult`](../type-aliases/JWTVerifyResult.md)\<`PayloadType`, `Algorithm`\>\>

## Call Signature

▸ **JWTVerifyFunction**\<`PayloadType`, `KeyType`\>(`jwt`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTVerifyResult`](../../../../types/interfaces/JWTVerifyResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

Callable JWT verifier restricted at runtime to the selected JWS algorithms.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |
| `KeyType` *extends* [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`JWSResolvedKey`](../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\> |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWT to process. |
| `getKey` | [`JWTVerifyGetKey`](JWTVerifyGetKey.md)\<`Algorithm`, `KeyType`\> | Function resolving a Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`JWTVerifyOptions`](../type-aliases/JWTVerifyOptions.md)\<`Algorithm`\> | Options for verification or decryption, including JWT Claims Set validation. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTVerifyResult`](../../../../types/interfaces/JWTVerifyResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<`KeyType`\>\>

## Call Signature

▸ **JWTVerifyFunction**\<`PayloadType`\>(`jwt`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTVerifyResult`](../../../../types/interfaces/JWTVerifyResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<[`JWSResolvedKey`](../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\>\>\>\>

Callable JWT verifier restricted at runtime to the selected JWS algorithms.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../../types/interfaces/JWTPayload.md) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `jwt` | `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | JWT to process. |
| `key` | [`JWSKeyInput`](../../../../algorithms/jws/type-aliases/JWSKeyInput.md)\<`Algorithm`\> \| [`JWTVerifyGetKey`](JWTVerifyGetKey.md)\<`Algorithm`, [`JWSResolvedKey`](../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\>\> | Key, Secret, or function resolving one, for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`JWTVerifyOptions`](../type-aliases/JWTVerifyOptions.md)\<`Algorithm`\> | Options for verification or decryption, including JWT Claims Set validation. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWTVerifyResult`](../../../../types/interfaces/JWTVerifyResult.md)\<`PayloadType`\>, `"protectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../types/interfaces/ResolvedKey.md)\<[`JWSResolvedKey`](../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\>\>\>\>
