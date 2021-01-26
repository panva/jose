# Interface: Signature

## Index

### Methods

* [setProtectedHeader](_jws_general_sign_.signature.md#setprotectedheader)
* [setUnprotectedHeader](_jws_general_sign_.signature.md#setunprotectedheader)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [JWSHeaderParameters](_types_d_.jwsheaderparameters.md)): [Signature](_jws_general_sign_.signature.md)

*Defined in [src/jws/general/sign.ts:13](https://github.com/panva/jose/blob/v3.5.4/src/jws/general/sign.ts#L13)*

Sets the JWS Protected Header on the Signature object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWSHeaderParameters](_types_d_.jwsheaderparameters.md) | JWS Protected Header.  |

**Returns:** [Signature](_jws_general_sign_.signature.md)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [JWSHeaderParameters](_types_d_.jwsheaderparameters.md)): [Signature](_jws_general_sign_.signature.md)

*Defined in [src/jws/general/sign.ts:20](https://github.com/panva/jose/blob/v3.5.4/src/jws/general/sign.ts#L20)*

Sets the JWS Unprotected Header on the Signature object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`unprotectedHeader` | [JWSHeaderParameters](_types_d_.jwsheaderparameters.md) | JWS Unprotected Header.  |

**Returns:** [Signature](_jws_general_sign_.signature.md)
