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

*Defined in [src/types.d.ts:386](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L386)*

Expected JWT "aud" (Audience) Claim value(s).

___

### clockTolerance

• `Optional` **clockTolerance**: string \| number

*Defined in [src/types.d.ts:393](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L393)*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds").

___

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: string[]

*Defined in [src/types.d.ts:359](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L359)*

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.

___

### crit

• `Optional` **crit**: { [propName:string]: boolean;  }

*Defined in [src/types.d.ts:342](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L342)*

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

*Defined in [src/types.d.ts:418](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L418)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### inflateRaw

• `Optional` **inflateRaw**: [InflateFunction](_types_d_.inflatefunction.md)

*Defined in [src/types.d.ts:365](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L365)*

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:398](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L398)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: string[]

*Defined in [src/types.d.ts:354](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L354)*

A list of accepted JWE "alg" (Algorithm) Header Parameter values.

___

### maxTokenAge

• `Optional` **maxTokenAge**: string

*Defined in [src/types.d.ts:403](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L403)*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.

___

### subject

• `Optional` **subject**: string

*Defined in [src/types.d.ts:408](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L408)*

Expected JWT "sub" (Subject) Claim value.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:413](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L413)*

Expected JWT "typ" (Type) Header Parameter value.
