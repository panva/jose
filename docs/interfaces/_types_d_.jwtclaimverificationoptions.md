# Interface: JWTClaimVerificationOptions

JWT Claims Set verification options.

## Index

### Properties

* [audience](_types_d_.jwtclaimverificationoptions.md#audience)
* [clockTolerance](_types_d_.jwtclaimverificationoptions.md#clocktolerance)
* [currentDate](_types_d_.jwtclaimverificationoptions.md#currentdate)
* [issuer](_types_d_.jwtclaimverificationoptions.md#issuer)
* [maxTokenAge](_types_d_.jwtclaimverificationoptions.md#maxtokenage)
* [subject](_types_d_.jwtclaimverificationoptions.md#subject)
* [typ](_types_d_.jwtclaimverificationoptions.md#typ)

## Properties

### audience

• `Optional` **audience**: string \| string[]

*Defined in [src/types.d.ts:422](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L422)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:429](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L429)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

___

### currentDate

• `Optional` **currentDate**: Date

*Defined in [src/types.d.ts:456](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L456)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:434](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L434)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### maxTokenAge

• `Optional` **maxTokenAge**: string \| number

*Defined in [src/types.d.ts:441](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L441)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:446](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L446)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:451](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L451)*

Expected JWT "typ" (Type) Header Parameter value.
