# Interface: JWTVerifyOptions

[jwt/verify](../modules/jwt_verify.md).JWTVerifyOptions

Combination of JWS Verification options and JWT Claims Set verification options.

## Hierarchy

- [`VerifyOptions`](types.VerifyOptions.md)

- [`JWTClaimVerificationOptions`](types.JWTClaimVerificationOptions.md)

  ↳ **`JWTVerifyOptions`**

## Table of contents

### Properties

- [algorithms](jwt_verify.JWTVerifyOptions.md#algorithms)
- [audience](jwt_verify.JWTVerifyOptions.md#audience)
- [clockTolerance](jwt_verify.JWTVerifyOptions.md#clocktolerance)
- [crit](jwt_verify.JWTVerifyOptions.md#crit)
- [currentDate](jwt_verify.JWTVerifyOptions.md#currentdate)
- [issuer](jwt_verify.JWTVerifyOptions.md#issuer)
- [maxTokenAge](jwt_verify.JWTVerifyOptions.md#maxtokenage)
- [subject](jwt_verify.JWTVerifyOptions.md#subject)
- [typ](jwt_verify.JWTVerifyOptions.md#typ)

## Properties

### algorithms

• `Optional` **algorithms**: `string`[]

A list of accepted JWS "alg" (Algorithm) Header Parameter values.
By default all "alg" (Algorithm) values applicable for the used
key/secret are allowed. Note: "none" is never accepted.

#### Inherited from

[VerifyOptions](types.VerifyOptions.md).[algorithms](types.VerifyOptions.md#algorithms)

#### Defined in

[types.d.ts:532](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L532)

___

### audience

• `Optional` **audience**: `string` \| `string`[]

Expected JWT "aud" (Audience) Claim value(s).

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[audience](types.JWTClaimVerificationOptions.md#audience)

#### Defined in

[types.d.ts:486](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L486)

___

### clockTolerance

• `Optional` **clockTolerance**: `string` \| `number`

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[clockTolerance](types.JWTClaimVerificationOptions.md#clocktolerance)

#### Defined in

[types.d.ts:493](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L493)

___

### crit

• `Optional` **crit**: `Object`

An object with keys representing recognized "crit" (Critical) Header Parameter
names. The value for those is either `true` or `false`. `true` when the
Header Parameter MUST be integrity protected, `false` when it's irrelevant.

This makes the "Extension Header Parameter "${parameter}" is not recognized"
error go away.

Use this when a given JWS/JWT/JWE profile requires the use of proprietary
non-registered "crit" (Critical) Header Parameters. This will only make sure
the Header Parameter is syntactically correct when provided and that it is
optionally integrity protected. It will not process the Header Parameter in
any way or reject if the operation if it is missing. You MUST still
verify the Header Parameter was present and process it according to the
profile's validation steps after the operation succeeds.

The JWS extension Header Parameter `b64` is always recognized and processed
properly. No other registered Header Parameters that need this kind of
default built-in treatment are currently available.

#### Index signature

▪ [propName: `string`]: `boolean`

#### Inherited from

[VerifyOptions](types.VerifyOptions.md).[crit](types.VerifyOptions.md#crit)

#### Defined in

[types.d.ts:440](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L440)

___

### currentDate

• `Optional` **currentDate**: `Date`

Date to use when comparing NumericDate claims, defaults to `new Date()`.

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[currentDate](types.JWTClaimVerificationOptions.md#currentdate)

#### Defined in

[types.d.ts:520](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L520)

___

### issuer

• `Optional` **issuer**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s).

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[issuer](types.JWTClaimVerificationOptions.md#issuer)

#### Defined in

[types.d.ts:498](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L498)

___

### maxTokenAge

• `Optional` **maxTokenAge**: `string` \| `number`

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[maxTokenAge](types.JWTClaimVerificationOptions.md#maxtokenage)

#### Defined in

[types.d.ts:505](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L505)

___

### subject

• `Optional` **subject**: `string`

Expected JWT "sub" (Subject) Claim value.

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[subject](types.JWTClaimVerificationOptions.md#subject)

#### Defined in

[types.d.ts:510](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L510)

___

### typ

• `Optional` **typ**: `string`

Expected JWT "typ" (Type) Header Parameter value.

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[typ](types.JWTClaimVerificationOptions.md#typ)

#### Defined in

[types.d.ts:515](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L515)
