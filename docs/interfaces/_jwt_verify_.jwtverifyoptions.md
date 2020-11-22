# Interface: JWTVerifyOptions

Combination of JWS Verification options and JWT Claims Set verification options.

## Index

### Properties

* [algorithms](_jwt_verify_.jwtverifyoptions.md#algorithms)
* [audience](_jwt_verify_.jwtverifyoptions.md#audience)
* [clockTolerance](_jwt_verify_.jwtverifyoptions.md#clocktolerance)
* [currentDate](_jwt_verify_.jwtverifyoptions.md#currentdate)
* [issuer](_jwt_verify_.jwtverifyoptions.md#issuer)
* [maxTokenAge](_jwt_verify_.jwtverifyoptions.md#maxtokenage)
* [subject](_jwt_verify_.jwtverifyoptions.md#subject)
* [typ](_jwt_verify_.jwtverifyoptions.md#typ)

## Properties

### algorithms

• `Optional` **algorithms**: string[]

*Defined in [src/types.d.ts:397](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L397)*

A list of accepted JWS "alg" (Algorithm) Header Parameter values.

___

### audience

• `Optional` **audience**: string \| string[]

*Defined in [src/types.d.ts:355](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L355)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:362](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L362)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds").

___

### currentDate

• `Optional` **currentDate**: Date

*Defined in [src/types.d.ts:387](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L387)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:367](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L367)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### maxTokenAge

• `Optional` **maxTokenAge**: string

*Defined in [src/types.d.ts:372](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L372)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:377](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L377)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:382](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L382)*

Expected JWT "typ" (Type) Header Parameter value.
