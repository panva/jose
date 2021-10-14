# Interface: Signature

## Table of contents

### Methods

- [setProtectedHeader](jws_general_sign.Signature.md#setprotectedheader)
- [setUnprotectedHeader](jws_general_sign.Signature.md#setunprotectedheader)

## Methods

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
