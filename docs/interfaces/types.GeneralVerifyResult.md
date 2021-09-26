# Interface: GeneralVerifyResult

[types](../modules/types.md).GeneralVerifyResult

## Hierarchy

- [`FlattenedVerifyResult`](types.FlattenedVerifyResult.md)

  ↳ **`GeneralVerifyResult`**

## Table of contents

### Properties

- [payload](types.GeneralVerifyResult.md#payload)
- [protectedHeader](types.GeneralVerifyResult.md#protectedheader)
- [unprotectedHeader](types.GeneralVerifyResult.md#unprotectedheader)

## Properties

### payload

• **payload**: `Uint8Array`

JWS Payload.

#### Inherited from

[FlattenedVerifyResult](types.FlattenedVerifyResult.md).[payload](types.FlattenedVerifyResult.md#payload)

#### Defined in

[types.d.ts:674](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L674)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Protected Header.

#### Inherited from

[FlattenedVerifyResult](types.FlattenedVerifyResult.md).[protectedHeader](types.FlattenedVerifyResult.md#protectedheader)

#### Defined in

[types.d.ts:679](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L679)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Unprotected Header.

#### Inherited from

[FlattenedVerifyResult](types.FlattenedVerifyResult.md).[unprotectedHeader](types.FlattenedVerifyResult.md#unprotectedheader)

#### Defined in

[types.d.ts:684](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L684)
