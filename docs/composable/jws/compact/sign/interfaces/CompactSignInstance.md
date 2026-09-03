# Interface: CompactSignInstance\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Interface implemented by a composed CompactSign instance.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Methods

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the Protected Header on the JWS, JWE, or JWT producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`SelectedCompactJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedCompactJWSHeaderParameters.md) | JOSE Protected Header accepted by this producer. |

#### Returns

`this`

***

### sign()

▸ **sign**(`key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Signs and resolves the JWS or signed JWT.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`JWSKeyInput`](../../../../../algorithms/jws/type-aliases/JWSKeyInput.md) | Private Key or Secret to sign the JWS or JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../../types/interfaces/SignOptions.md) | JWS or JWT Sign options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>
