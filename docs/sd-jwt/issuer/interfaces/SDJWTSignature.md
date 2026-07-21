# Interface: SDJWTSignature

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Used to build individual signatures on a [GeneralSignSDJWT](../classes/GeneralSignSDJWT.md).

## Methods

### addSignature()

▸ **addSignature**(...`args`): `SDJWTSignature`

Adds another signature to the enclosing [GeneralSignSDJWT](../classes/GeneralSignSDJWT.md).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | \[[`SDJWTIssuerSigningKey`](../type-aliases/SDJWTIssuerSigningKey.md), [`SignOptions`](../../../types/interfaces/SignOptions.md)\] |

#### Returns

`SDJWTSignature`

***

### done()

▸ **done**(): [`GeneralSignSDJWT`](../classes/GeneralSignSDJWT.md)

Returns the enclosing [GeneralSignSDJWT](../classes/GeneralSignSDJWT.md).

#### Returns

[`GeneralSignSDJWT`](../classes/GeneralSignSDJWT.md)

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `SDJWTSignature`

Sets the JWS Protected Header on this signature.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md) |

#### Returns

`SDJWTSignature`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `SDJWTSignature`

Sets the JWS Unprotected Header on this signature. Its members are not integrity protected and
must not drive security decisions. `typ` is rejected here and must be set in the protected
header.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md) |

#### Returns

`SDJWTSignature`

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\>

Signs using the enclosing [GeneralSignSDJWT](../classes/GeneralSignSDJWT.md).

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralSDJWT`](../../../types/interfaces/GeneralSDJWT.md)\>
