# Interface: Signature

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

## Table of contents

### Methods

- [addSignature](jws_general_sign.Signature.md#addsignature)
- [done](jws_general_sign.Signature.md#done)
- [setProtectedHeader](jws_general_sign.Signature.md#setprotectedheader)
- [setUnprotectedHeader](jws_general_sign.Signature.md#setunprotectedheader)
- [sign](jws_general_sign.Signature.md#sign)

## Methods

### addSignature

▸ **addSignature**(`...args`): [`Signature`](jws_general_sign.Signature.md)

A shorthand for calling addSignature() on the enclosing GeneralSign instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [key: Uint8Array \| KeyLike \| JWK, options?: SignOptions] |

#### Returns

[`Signature`](jws_general_sign.Signature.md)

___

### done

▸ **done**(): [`GeneralSign`](../classes/jws_general_sign.GeneralSign.md)

Returns the enclosing GeneralSign

#### Returns

[`GeneralSign`](../classes/jws_general_sign.GeneralSign.md)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`Signature`](jws_general_sign.Signature.md)

Sets the JWS Protected Header on the Signature object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWSHeaderParameters`](types.JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

[`Signature`](jws_general_sign.Signature.md)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`): [`Signature`](jws_general_sign.Signature.md)

Sets the JWS Unprotected Header on the Signature object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](types.JWSHeaderParameters.md) | JWS Unprotected Header. |

#### Returns

[`Signature`](jws_general_sign.Signature.md)

___

### sign

▸ **sign**(`...args`): [`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`GeneralJWS`](types.GeneralJWS.md)\>

A shorthand for calling encrypt() on the enclosing GeneralSign instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] |

#### Returns

[`Promise`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise )\<[`GeneralJWS`](types.GeneralJWS.md)\>
