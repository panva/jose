# Interface: JWTDecryptOptions

Combination of JWE Decryption options and JWT Claims Set verification options.

## Index

### Properties

* [audience](_jwt_decrypt_.jwtdecryptoptions.md#audience)
* [clockTolerance](_jwt_decrypt_.jwtdecryptoptions.md#clocktolerance)
* [contentEncryptionAlgorithms](_jwt_decrypt_.jwtdecryptoptions.md#contentencryptionalgorithms)
* [crit](_jwt_decrypt_.jwtdecryptoptions.md#crit)
* [currentDate](_jwt_decrypt_.jwtdecryptoptions.md#currentdate)
* [inflateRaw](_jwt_decrypt_.jwtdecryptoptions.md#inflateraw)
* [issuer](_jwt_decrypt_.jwtdecryptoptions.md#issuer)
* [keyManagementAlgorithms](_jwt_decrypt_.jwtdecryptoptions.md#keymanagementalgorithms)
* [maxTokenAge](_jwt_decrypt_.jwtdecryptoptions.md#maxtokenage)
* [subject](_jwt_decrypt_.jwtdecryptoptions.md#subject)
* [typ](_jwt_decrypt_.jwtdecryptoptions.md#typ)

## Properties

### audience

• `Optional` **audience**: string \| string[]

*Defined in [src/types.d.ts:422](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L422)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:429](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L429)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds").

___

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: string[]

*Defined in [src/types.d.ts:395](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L395)*

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.

___

### crit

• `Optional` **crit**: { [propName:string]: boolean;  }

*Defined in [src/types.d.ts:378](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L378)*

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

*Defined in [src/types.d.ts:454](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L454)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### inflateRaw

• `Optional` **inflateRaw**: [InflateFunction](_types_d_.inflatefunction.md)

*Defined in [src/types.d.ts:401](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L401)*

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:434](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L434)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: string[]

*Defined in [src/types.d.ts:390](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L390)*

A list of accepted JWE "alg" (Algorithm) Header Parameter values.

___

### maxTokenAge

• `Optional` **maxTokenAge**: string

*Defined in [src/types.d.ts:439](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L439)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:444](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L444)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:449](https://github.com/panva/jose/blob/v3.6.0/src/types.d.ts#L449)*

Expected JWT "typ" (Type) Header Parameter value.
