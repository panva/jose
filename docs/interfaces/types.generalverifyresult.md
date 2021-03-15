# Interface: GeneralVerifyResult

[types](../modules/types.md).GeneralVerifyResult

## Hierarchy

* [*FlattenedVerifyResult*](types.flattenedverifyresult.md)

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

Defined in: [types.d.ts:579](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L579)

___

### protectedHeader

• `Optional` **protectedHeader**: [*JWSHeaderParameters*](types.jwsheaderparameters.md)

JWS Protected Header.

Inherited from: [FlattenedVerifyResult](types.flattenedverifyresult.md).[protectedHeader](types.flattenedverifyresult.md#protectedheader)

Defined in: [types.d.ts:584](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L584)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [*JWSHeaderParameters*](types.jwsheaderparameters.md)

JWS Unprotected Header.

Inherited from: [FlattenedVerifyResult](types.flattenedverifyresult.md).[unprotectedHeader](types.flattenedverifyresult.md#unprotectedheader)

Defined in: [types.d.ts:589](https://github.com/panva/jose/blob/v3.9.0/src/types.d.ts#L589)
