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

[types.d.ts:486](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L486)

___

### clockTolerance

• `Optional` **clockTolerance**: `string` \| `number`

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Defined in

[types.d.ts:493](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L493)

___

### currentDate

• `Optional` **currentDate**: `Date`

Date to use when comparing NumericDate claims, defaults to `new Date()`.

#### Defined in

[types.d.ts:520](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L520)

___

### issuer

• `Optional` **issuer**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s).

#### Defined in

[types.d.ts:498](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L498)

___

### maxTokenAge

• `Optional` **maxTokenAge**: `string` \| `number`

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Defined in

[types.d.ts:505](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L505)

___

### subject

• `Optional` **subject**: `string`

Expected JWT "sub" (Subject) Claim value.

#### Defined in

[types.d.ts:510](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L510)

___

### typ

• `Optional` **typ**: `string`

Expected JWT "typ" (Type) Header Parameter value.

#### Defined in

[types.d.ts:515](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L515)
