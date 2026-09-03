# Interface: GeneralSignInstance\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Interface implemented by a composed GeneralSign instance.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Methods

### addSignature()

▸ **addSignature**(`key`, `options?`): [`GeneralSignature`](GeneralSignature.md)\<`Algorithm`\>

Adds an additional signature for the General JWS object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`JWSKeyInput`](../../../../../algorithms/jws/type-aliases/JWSKeyInput.md)\<`Algorithm`\> | Private Key or Secret to sign the individual JWS signature with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

[`GeneralSignature`](GeneralSignature.md)\<`Algorithm`\>

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../../types/interfaces/GeneralJWS.md)\>

Signs and resolves the value of the General JWS object.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../../types/interfaces/GeneralJWS.md)\>
