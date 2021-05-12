# Interface: Signature

[jws/general/sign](../modules/jws_general_sign.md).Signature

## Table of contents

### Methods

- [setProtectedHeader](jws_general_sign.signature.md#setprotectedheader)
- [setUnprotectedHeader](jws_general_sign.signature.md#setunprotectedheader)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [*JWSHeaderParameters*](types.jwsheaderparameters.md)): [*Signature*](jws_general_sign.signature.md)

Sets the JWS Protected Header on the Signature object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [*JWSHeaderParameters*](types.jwsheaderparameters.md) | JWS Protected Header. |

**Returns:** [*Signature*](jws_general_sign.signature.md)

Defined in: [jws/general/sign.ts:13](https://github.com/panva/jose/blob/v3.12.0/src/jws/general/sign.ts#L13)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [*JWSHeaderParameters*](types.jwsheaderparameters.md)): [*Signature*](jws_general_sign.signature.md)

Sets the JWS Unprotected Header on the Signature object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `unprotectedHeader` | [*JWSHeaderParameters*](types.jwsheaderparameters.md) | JWS Unprotected Header. |

**Returns:** [*Signature*](jws_general_sign.signature.md)

Defined in: [jws/general/sign.ts:20](https://github.com/panva/jose/blob/v3.12.0/src/jws/general/sign.ts#L20)
