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

[types.d.ts:646](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L646)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Protected Header.

#### Inherited from

[FlattenedVerifyResult](types.FlattenedVerifyResult.md).[protectedHeader](types.FlattenedVerifyResult.md#protectedheader)

#### Defined in

[types.d.ts:651](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L651)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Unprotected Header.

#### Inherited from

[FlattenedVerifyResult](types.FlattenedVerifyResult.md).[unprotectedHeader](types.FlattenedVerifyResult.md#unprotectedheader)

#### Defined in

[types.d.ts:656](https://github.com/panva/jose/blob/v3.14.1/src/types.d.ts#L656)
