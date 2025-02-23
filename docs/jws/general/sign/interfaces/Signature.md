# Interface: Signature

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build General JWS object's individual signatures.

## Methods

### addSignature()

▸ **addSignature**(...`args`): [`Signature`](Signature.md)

A shorthand for calling addSignature() on the enclosing GeneralSign instance

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | [[`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`JWK`](../../../../types/interfaces/JWK.md) \| [`KeyObject`](../../../../types/interfaces/KeyObject.md), [`SignOptions`](../../../../types/interfaces/SignOptions.md)] |

#### Returns

[`Signature`](Signature.md)

***

### done()

▸ **done**(): [`GeneralSign`](../classes/GeneralSign.md)

Returns the enclosing GeneralSign

#### Returns

[`GeneralSign`](../classes/GeneralSign.md)

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): [`Signature`](Signature.md)

Sets the JWS Protected Header on the Signature object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

[`Signature`](Signature.md)

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): [`Signature`](Signature.md)

Sets the JWS Unprotected Header on the Signature object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Unprotected Header. |

#### Returns

[`Signature`](Signature.md)

***

### sign()

▸ **sign**(...`args`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>

A shorthand for calling encrypt() on the enclosing GeneralSign instance

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | [] |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>
