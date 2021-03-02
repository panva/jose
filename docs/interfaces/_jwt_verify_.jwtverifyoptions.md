# Interface: JWTVerifyOptions

Combination of JWS Verification options and JWT Claims Set verification options.

## Index

### Properties

* [algorithms](_jwt_verify_.jwtverifyoptions.md#algorithms)
* [audience](_jwt_verify_.jwtverifyoptions.md#audience)
* [clockTolerance](_jwt_verify_.jwtverifyoptions.md#clocktolerance)
* [crit](_jwt_verify_.jwtverifyoptions.md#crit)
* [currentDate](_jwt_verify_.jwtverifyoptions.md#currentdate)
* [issuer](_jwt_verify_.jwtverifyoptions.md#issuer)
* [maxTokenAge](_jwt_verify_.jwtverifyoptions.md#maxtokenage)
* [subject](_jwt_verify_.jwtverifyoptions.md#subject)
* [typ](_jwt_verify_.jwtverifyoptions.md#typ)

## Properties

### algorithms

• `Optional` **algorithms**: string[]

*Defined in [src/types.d.ts:466](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L466)*

A list of accepted JWS "alg" (Algorithm) Header Parameter values.

___

### audience

• `Optional` **audience**: string \| string[]

*Defined in [src/types.d.ts:422](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L422)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:429](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L429)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

___

### crit

• `Optional` **crit**: { [propName:string]: boolean;  }

*Defined in [src/types.d.ts:378](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L378)*

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

___

### currentDate

• `Optional` **currentDate**: Date

*Defined in [src/types.d.ts:456](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L456)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:434](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L434)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### maxTokenAge

• `Optional` **maxTokenAge**: string \| number

*Defined in [src/types.d.ts:441](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L441)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:446](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L446)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:451](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L451)*

Expected JWT "typ" (Type) Header Parameter value.
