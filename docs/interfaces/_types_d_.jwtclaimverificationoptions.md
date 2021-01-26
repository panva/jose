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

*Defined in [src/types.d.ts:422](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L422)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:429](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L429)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds").

___

### currentDate

• `Optional` **currentDate**: Date

*Defined in [src/types.d.ts:454](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L454)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:434](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L434)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### maxTokenAge

• `Optional` **maxTokenAge**: string

*Defined in [src/types.d.ts:439](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L439)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:444](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L444)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:449](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L449)*

Expected JWT "typ" (Type) Header Parameter value.
