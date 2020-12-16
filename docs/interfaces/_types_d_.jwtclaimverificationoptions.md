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

*Defined in [src/types.d.ts:418](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L418)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:425](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L425)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds").

___

### currentDate

• `Optional` **currentDate**: Date

*Defined in [src/types.d.ts:450](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L450)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:430](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L430)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### maxTokenAge

• `Optional` **maxTokenAge**: string

*Defined in [src/types.d.ts:435](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L435)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:440](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L440)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:445](https://github.com/panva/jose/blob/v3.4.0/src/types.d.ts#L445)*

Expected JWT "typ" (Type) Header Parameter value.
