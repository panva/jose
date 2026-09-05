# Interface: Signature

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Configures an individual signature in a General JWS.

## Methods

### addSignature()

▸ **addSignature**(`key`, `options?`): `Signature`

Adds another signature to the enclosing [GeneralSign](../classes/GeneralSign.md) and returns its configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Private key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

`Signature`

***

### done()

▸ **done**(): [`GeneralSign`](../classes/GeneralSign.md)

Returns the enclosing [GeneralSign](../classes/GeneralSign.md) instance.

#### Returns

[`GeneralSign`](../classes/GeneralSign.md)

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `Signature`

Sets the JWS Protected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

`Signature`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `Signature`

Sets the JWS Unprotected Header. May only be called once.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Unprotected Header. |

#### Returns

`Signature`

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>

Creates all signatures on the enclosing [GeneralSign](../classes/GeneralSign.md), using their configured keys.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>
