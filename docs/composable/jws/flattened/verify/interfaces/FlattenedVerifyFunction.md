# Interface: FlattenedVerifyFunction()\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Callable Flattened JWS verifier restricted at runtime to the selected algorithms.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Call Signature

▸ **FlattenedVerifyFunction**(`input`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedVerifyResult`](../type-aliases/FlattenedVerifyResult.md)\<`Algorithm`\>\>

Processes the JOSE input with a directly supplied key.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`FlattenedJWSInput`](../../../../../types/interfaces/FlattenedJWSInput.md) | JOSE input to process. |
| `key` | [`JWSKeyInput`](../../../../../algorithms/jws/type-aliases/JWSKeyInput.md) | Key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`SelectedJWSVerifyOptions`](../../../../../algorithms/jws/type-aliases/SelectedJWSVerifyOptions.md)\<`Algorithm`\> | Options for verification or decryption, including JWT Claims Set validation when applicable. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedVerifyResult`](../type-aliases/FlattenedVerifyResult.md)\<`Algorithm`\>\>

## Call Signature

▸ **FlattenedVerifyFunction**\<`Resolved`\>(`input`, `getKey`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedVerifyResult`](../../../../../types/interfaces/FlattenedVerifyResult.md), `"protectedHeader"` \| `"unprotectedHeader"`\> & `object` & [`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<`Resolved`\>\>

Processes the JOSE input, resolving the key dynamically. The result additionally carries the
[resolved key](../../../../../types/interfaces/ResolvedKey.md#key).

### Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `Resolved` *extends* [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`JWSResolvedKey`](../../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\> | Concrete key type returned by the resolver and exposed as `result.key`. |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`FlattenedJWSInput`](../../../../../types/interfaces/FlattenedJWSInput.md) | JOSE input to process. |
| `getKey` | [`GetKeyFunction`](../../../../../types/interfaces/GetKeyFunction.md)\<[`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>, [`FlattenedJWSInput`](../../../../../types/interfaces/FlattenedJWSInput.md), [`JWK`](../../../../../types/type-aliases/JWK.md) \| [`KeyObject`](../../../../../types/interfaces/KeyObject.md) \| `Resolved`\> | Function resolving a key or Secret for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`SelectedJWSVerifyOptions`](../../../../../algorithms/jws/type-aliases/SelectedJWSVerifyOptions.md)\<`Algorithm`\> | Options for verification or decryption, including JWT Claims Set validation when applicable. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedVerifyResult`](../../../../../types/interfaces/FlattenedVerifyResult.md), `"protectedHeader"` \| `"unprotectedHeader"`\> & `object` & [`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<`Resolved`\>\>

## Call Signature

▸ **FlattenedVerifyFunction**(`input`, `key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedVerifyResult`](../../../../../types/interfaces/FlattenedVerifyResult.md), `"protectedHeader"` \| `"unprotectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<[`JWSResolvedKey`](../../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\>\>\>\>

Accepts either a directly supplied key or a dynamic key resolver. Use this overload when
forwarding a value whose form is not statically known; `key` is present on the result only when
a resolver was used.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`FlattenedJWSInput`](../../../../../types/interfaces/FlattenedJWSInput.md) | JOSE input to process. |
| `key` | [`JWSKeyInput`](../../../../../algorithms/jws/type-aliases/JWSKeyInput.md)\<`Algorithm`\> \| [`GetKeyFunction`](../../../../../types/interfaces/GetKeyFunction.md)\<[`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md)\<`Algorithm`\>, [`FlattenedJWSInput`](../../../../../types/interfaces/FlattenedJWSInput.md), JWK \| KeyObject \| JWSResolvedKey\<Algorithm\>\> | Key, Secret, or function resolving one, for the operation. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210). |
| `options?` | [`SelectedJWSVerifyOptions`](../../../../../algorithms/jws/type-aliases/SelectedJWSVerifyOptions.md)\<`Algorithm`\> | Options for verification or decryption, including JWT Claims Set validation when applicable. |

### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedVerifyResult`](../../../../../types/interfaces/FlattenedVerifyResult.md), `"protectedHeader"` \| `"unprotectedHeader"`\> & `object` & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`ResolvedKey`](../../../../../types/interfaces/ResolvedKey.md)\<[`JWSResolvedKey`](../../../../../algorithms/jws/type-aliases/JWSResolvedKey.md)\<`Algorithm`\>\>\>\>
