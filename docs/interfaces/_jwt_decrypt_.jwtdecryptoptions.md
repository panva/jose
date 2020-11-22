# Interface: JWTDecryptOptions

Combination of JWE Decryption options and JWT Claims Set verification options.

## Index

### Properties

* [audience](_jwt_decrypt_.jwtdecryptoptions.md#audience)
* [clockTolerance](_jwt_decrypt_.jwtdecryptoptions.md#clocktolerance)
* [contentEncryptionAlgorithms](_jwt_decrypt_.jwtdecryptoptions.md#contentencryptionalgorithms)
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

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: string[]

*Defined in [src/types.d.ts:328](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L328)*

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.

___

### currentDate

• `Optional` **currentDate**: Date

*Defined in [src/types.d.ts:387](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L387)*

Date to use when comparing NumericDate claims, defaults to `new Date()`.

___

### inflateRaw

• `Optional` **inflateRaw**: [InflateFunction](_types_d_.inflatefunction.md)

*Defined in [src/types.d.ts:334](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L334)*

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

___

### issuer

• `Optional` **issuer**: string \| string[]

*Defined in [src/types.d.ts:367](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L367)*

Expected JWT "iss" (Issuer) Claim value(s).

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: string[]

*Defined in [src/types.d.ts:323](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L323)*

A list of accepted JWE "alg" (Algorithm) Header Parameter values.

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
