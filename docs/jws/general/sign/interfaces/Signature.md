# Interface: Signature

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build General JWS object's individual signatures.

## Methods

### addSignature()

▸ **addSignature**(`key`, `options?`): `Signature`

A shorthand for calling [addSignature()](../classes/GeneralSign.md#addsignature) on the enclosing
[GeneralSign](../classes/GeneralSign.md) instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Private Key or Secret to sign the individual JWS signature with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

`Signature`

***

### done()

▸ **done**(): [`GeneralSign`](../classes/GeneralSign.md)

Returns the enclosing [GeneralSign](../classes/GeneralSign.md) instance

#### Returns

[`GeneralSign`](../classes/GeneralSign.md)

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `Signature`

Sets the JWS Protected Header on the Signature object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

`Signature`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `Signature`

Sets the JWS Unprotected Header on the Signature object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Unprotected Header. |

#### Returns

`Signature`

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>

A shorthand for calling `sign()` on the enclosing `GeneralSign` instance. Takes no arguments —
each signature's key is supplied to `addSignature()`.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>
