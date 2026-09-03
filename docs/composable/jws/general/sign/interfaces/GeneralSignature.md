# Interface: GeneralSignature\<Algorithm\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build a General JWS object's individual signatures.

## Type Parameters

| Type Parameter |
| ------ |
| `Algorithm` *extends* `string` |

## Methods

### addSignature()

▸ **addSignature**(`key`, `options?`): `GeneralSignature`\<`Algorithm`\>

A shorthand for calling [addSignature()](GeneralSignInstance.md#addsignature) on the enclosing
GeneralSign instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`JWSKeyInput`](../../../../../algorithms/jws/type-aliases/JWSKeyInput.md)\<`Algorithm`\> | Private Key or Secret to sign the individual JWS signature with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

`GeneralSignature`\<`Algorithm`\>

***

### done()

▸ **done**(): [`GeneralSignInstance`](GeneralSignInstance.md)\<`Algorithm`\>

Returns the enclosing GeneralSign instance.

#### Returns

[`GeneralSignInstance`](GeneralSignInstance.md)\<`Algorithm`\>

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the Protected Header on the JWS, JWE, or JWT producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md) | JOSE Protected Header accepted by this producer. |

#### Returns

`this`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `this`

Sets the JWS Unprotected Header or JWE Per-Recipient Unprotected Header on the producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`SelectedJWSHeaderParameters`](../../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md) | JWS Unprotected Header or JWE Per-Recipient Unprotected Header. |

#### Returns

`this`

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../../types/interfaces/GeneralJWS.md)\>

A shorthand for calling `sign()` on the enclosing `GeneralSign` instance. Takes no arguments —
each signature's key is supplied to `addSignature()`.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../../types/interfaces/GeneralJWS.md)\>
