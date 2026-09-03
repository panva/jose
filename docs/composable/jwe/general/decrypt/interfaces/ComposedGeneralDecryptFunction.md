# Interface: ComposedGeneralDecryptFunction()\<Factories\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A General JWE decryptor restricted to the selected algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |

## Call Signature

▸ **ComposedGeneralDecryptFunction**(`input`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`ComposedGeneralDecryptResult`](../type-aliases/ComposedGeneralDecryptResult.md)\<`Factories`\>\>

Processes the JOSE input with a directly supplied key.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md) | JOSE input to process. |
| `key` | [`KeyInput`](../../../../../types/type-aliases/KeyInput.md) | Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`ComposedDecryptOptions`](../../../../jwt/decrypt/type-aliases/ComposedDecryptOptions.md)\<`Factories`\> | Options for verification or decryption, including JWT Claims Set validation when applicable. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`ComposedGeneralDecryptResult`](../type-aliases/ComposedGeneralDecryptResult.md)\<`Factories`\>\>

## Call Signature

▸ **ComposedGeneralDecryptFunction**\<`Resolved`\>(`input`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedDecryptResult`](../../../../../types/interfaces/FlattenedDecryptResult.md), `"protectedHeader"` \| `"unprotectedHeader"` \| `"sharedUnprotectedHeader"`\> & `object` & [`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<`Resolved`\>\>

Processes the JOSE input, resolving the key dynamically. The result additionally carries the
[resolved key](../../../../../types/interfaces/ResolvedKey.md#key).

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `Resolved` *extends* [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) | Concrete key type returned by the resolver and exposed as `result.key`. |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md) | JOSE input to process. |
| `getKey` | [`GetKeyFunction`](../../../../../types/interfaces/GetKeyFunction.md)\<[`ComposedJWEHeader`](../../../flattened/encrypt/interfaces/ComposedJWEHeader.md)\<`Factories`\> \| `undefined`, [`FlattenedJWE`](../../../../../types/interfaces/FlattenedJWE.md), [`JWK`](../../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../../types/interfaces/KeyObject.md) \| `Resolved`\> | Function resolving a key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`ComposedDecryptOptions`](../../../../jwt/decrypt/type-aliases/ComposedDecryptOptions.md)\<`Factories`\> | Options for verification or decryption, including JWT Claims Set validation when applicable. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedDecryptResult`](../../../../../types/interfaces/FlattenedDecryptResult.md), `"protectedHeader"` \| `"unprotectedHeader"` \| `"sharedUnprotectedHeader"`\> & `object` & [`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<`Resolved`\>\>

## Call Signature

▸ **ComposedGeneralDecryptFunction**(`input`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedDecryptResult`](../../../../../types/interfaces/FlattenedDecryptResult.md), `"protectedHeader"` \| `"unprotectedHeader"` \| `"sharedUnprotectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>

Accepts either a directly supplied key or a dynamic key resolver. Use this overload when
forwarding a value whose form is not statically known; `key` is present on the result only when
a resolver was used.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`GeneralJWE`](../../../../../types/interfaces/GeneralJWE.md) | JOSE input to process. |
| `key` | [`KeyInput`](../../../../../types/type-aliases/KeyInput.md) \| [`GetKeyFunction`](../../../../../types/interfaces/GetKeyFunction.md)\<[`ComposedJWEHeader`](../../../flattened/encrypt/interfaces/ComposedJWEHeader.md)\<`Factories`\> \| `undefined`, [`FlattenedJWE`](../../../../../types/interfaces/FlattenedJWE.md), [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../../types/interfaces/KeyObject.md)\> | Key, Secret, or function resolving one, for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`ComposedDecryptOptions`](../../../../jwt/decrypt/type-aliases/ComposedDecryptOptions.md)\<`Factories`\> | Options for verification or decryption, including JWT Claims Set validation when applicable. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedDecryptResult`](../../../../../types/interfaces/FlattenedDecryptResult.md), `"protectedHeader"` \| `"unprotectedHeader"` \| `"sharedUnprotectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)\>\>\>
