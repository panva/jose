# Interface: GeneralVerifyResult

[types](../modules/types.md).GeneralVerifyResult

## Hierarchy

- [*FlattenedVerifyResult*](types.flattenedverifyresult.md)

  ↳ **GeneralVerifyResult**

## Table of contents

### Properties

- [payload](types.generalverifyresult.md#payload)
- [protectedHeader](types.generalverifyresult.md#protectedheader)
- [unprotectedHeader](types.generalverifyresult.md#unprotectedheader)

## Properties

### payload

• **payload**: *Uint8Array*

JWS Payload.

Inherited from: [FlattenedVerifyResult](types.flattenedverifyresult.md).[payload](types.flattenedverifyresult.md#payload)

Defined in: [types.d.ts:639](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L639)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWSHeaderParameters*](types.jwsheaderparameters.md)

JWS Protected Header.

Inherited from: [FlattenedVerifyResult](types.flattenedverifyresult.md).[protectedHeader](types.flattenedverifyresult.md#protectedheader)

Defined in: [types.d.ts:644](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L644)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWSHeaderParameters*](types.jwsheaderparameters.md)

JWS Unprotected Header.

Inherited from: [FlattenedVerifyResult](types.flattenedverifyresult.md).[unprotectedHeader](types.flattenedverifyresult.md#unprotectedheader)

Defined in: [types.d.ts:649](https://github.com/panva/jose/blob/v3.12.2/src/types.d.ts#L649)
