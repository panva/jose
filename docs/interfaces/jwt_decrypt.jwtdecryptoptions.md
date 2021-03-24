# Interface: JWTDecryptOptions

[jwt/decrypt](../modules/jwt_decrypt.md).JWTDecryptOptions

Combination of JWE Decryption options and JWT Claims Set verification options.

## Hierarchy

* [*DecryptOptions*](types.decryptoptions.md)

* [*JWTClaimVerificationOptions*](types.jwtclaimverificationoptions.md)

  ↳ **JWTDecryptOptions**

## Table of contents

### Properties

- [audience](jwt_decrypt.jwtdecryptoptions.md#audience)
- [clockTolerance](jwt_decrypt.jwtdecryptoptions.md#clocktolerance)
- [contentEncryptionAlgorithms](jwt_decrypt.jwtdecryptoptions.md#contentencryptionalgorithms)
- [crit](jwt_decrypt.jwtdecryptoptions.md#crit)
- [currentDate](jwt_decrypt.jwtdecryptoptions.md#currentdate)
- [inflateRaw](jwt_decrypt.jwtdecryptoptions.md#inflateraw)
- [issuer](jwt_decrypt.jwtdecryptoptions.md#issuer)
- [keyManagementAlgorithms](jwt_decrypt.jwtdecryptoptions.md#keymanagementalgorithms)
- [maxTokenAge](jwt_decrypt.jwtdecryptoptions.md#maxtokenage)
- [subject](jwt_decrypt.jwtdecryptoptions.md#subject)
- [typ](jwt_decrypt.jwtdecryptoptions.md#typ)

## Properties

### audience

• `Optional` **audience**: *string* \| *string*[]

Expected JWT "aud" (Audience) Claim value(s).

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[audience](types.jwtclaimverificationoptions.md#audience)

Defined in: [types.d.ts:422](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L422)

___

### clockTolerance

• `Optional` **clockTolerance**: *string* \| *number*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[clockTolerance](types.jwtclaimverificationoptions.md#clocktolerance)

Defined in: [types.d.ts:429](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L429)

___

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: *string*[]

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.

Inherited from: [DecryptOptions](types.decryptoptions.md).[contentEncryptionAlgorithms](types.decryptoptions.md#contentencryptionalgorithms)

Defined in: [types.d.ts:395](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L395)

___

### crit

• `Optional` **crit**: *object*

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

#### Type declaration:

Inherited from: [DecryptOptions](types.decryptoptions.md).[crit](types.decryptoptions.md#crit)

Defined in: [types.d.ts:378](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L378)

___

### currentDate

• `Optional` **currentDate**: Date

Date to use when comparing NumericDate claims, defaults to `new Date()`.

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[currentDate](types.jwtclaimverificationoptions.md#currentdate)

Defined in: [types.d.ts:456](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L456)

___

### inflateRaw

• `Optional` **inflateRaw**: [*InflateFunction*](types.inflatefunction.md)

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

Inherited from: [DecryptOptions](types.decryptoptions.md).[inflateRaw](types.decryptoptions.md#inflateraw)

Defined in: [types.d.ts:401](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L401)

___

### issuer

• `Optional` **issuer**: *string* \| *string*[]

Expected JWT "iss" (Issuer) Claim value(s).

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[issuer](types.jwtclaimverificationoptions.md#issuer)

Defined in: [types.d.ts:434](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L434)

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: *string*[]

A list of accepted JWE "alg" (Algorithm) Header Parameter values.

Inherited from: [DecryptOptions](types.decryptoptions.md).[keyManagementAlgorithms](types.decryptoptions.md#keymanagementalgorithms)

Defined in: [types.d.ts:390](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L390)

___

### maxTokenAge

• `Optional` **maxTokenAge**: *string* \| *number*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[maxTokenAge](types.jwtclaimverificationoptions.md#maxtokenage)

Defined in: [types.d.ts:441](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L441)

___

### subject

• `Optional` **subject**: *string*

Expected JWT "sub" (Subject) Claim value.

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[subject](types.jwtclaimverificationoptions.md#subject)

Defined in: [types.d.ts:446](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L446)

___

### typ

• `Optional` **typ**: *string*

Expected JWT "typ" (Type) Header Parameter value.

Inherited from: [JWTClaimVerificationOptions](types.jwtclaimverificationoptions.md).[typ](types.jwtclaimverificationoptions.md#typ)

Defined in: [types.d.ts:451](https://github.com/panva/jose/blob/v3.11.0/src/types.d.ts#L451)
