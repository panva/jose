# Interface: JWTClaimVerificationOptions

[types](../modules/types.md).JWTClaimVerificationOptions

JWT Claims Set verification options.

## Hierarchy

- **`JWTClaimVerificationOptions`**

  ↳ [`JWTDecryptOptions`](jwt_decrypt.JWTDecryptOptions.md)

  ↳ [`JWTVerifyOptions`](jwt_verify.JWTVerifyOptions.md)

## Table of contents

### Properties

- [audience](types.JWTClaimVerificationOptions.md#audience)
- [clockTolerance](types.JWTClaimVerificationOptions.md#clocktolerance)
- [currentDate](types.JWTClaimVerificationOptions.md#currentdate)
- [issuer](types.JWTClaimVerificationOptions.md#issuer)
- [maxTokenAge](types.JWTClaimVerificationOptions.md#maxtokenage)
- [subject](types.JWTClaimVerificationOptions.md#subject)
- [typ](types.JWTClaimVerificationOptions.md#typ)

## Properties

### audience

• `Optional` **audience**: `string` \| `string`[]

Expected JWT "aud" (Audience) Claim value(s).

#### Defined in

[types.d.ts:487](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L487)

___

### clockTolerance

• `Optional` **clockTolerance**: `string` \| `number`

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Defined in

[types.d.ts:494](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L494)

___

### currentDate

• `Optional` **currentDate**: `Date`

Date to use when comparing NumericDate claims, defaults to `new Date()`.

#### Defined in

[types.d.ts:521](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L521)

___

### issuer

• `Optional` **issuer**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s).

#### Defined in

[types.d.ts:499](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L499)

___

### maxTokenAge

• `Optional` **maxTokenAge**: `string` \| `number`

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Defined in

[types.d.ts:506](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L506)

___

### subject

• `Optional` **subject**: `string`

Expected JWT "sub" (Subject) Claim value.

#### Defined in

[types.d.ts:511](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L511)

___

### typ

• `Optional` **typ**: `string`

Expected JWT "typ" (Type) Header Parameter value.

#### Defined in

[types.d.ts:516](https://github.com/panva/jose/blob/v3.14.2/src/types.d.ts#L516)
