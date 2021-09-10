# Interface: JWTDecryptOptions

[jwt/decrypt](../modules/jwt_decrypt.md).JWTDecryptOptions

Combination of JWE Decryption options and JWT Claims Set verification options.

## Hierarchy

- [`DecryptOptions`](types.DecryptOptions.md)

- [`JWTClaimVerificationOptions`](types.JWTClaimVerificationOptions.md)

  ↳ **`JWTDecryptOptions`**

## Table of contents

### Properties

- [audience](jwt_decrypt.JWTDecryptOptions.md#audience)
- [clockTolerance](jwt_decrypt.JWTDecryptOptions.md#clocktolerance)
- [contentEncryptionAlgorithms](jwt_decrypt.JWTDecryptOptions.md#contentencryptionalgorithms)
- [crit](jwt_decrypt.JWTDecryptOptions.md#crit)
- [currentDate](jwt_decrypt.JWTDecryptOptions.md#currentdate)
- [inflateRaw](jwt_decrypt.JWTDecryptOptions.md#inflateraw)
- [issuer](jwt_decrypt.JWTDecryptOptions.md#issuer)
- [keyManagementAlgorithms](jwt_decrypt.JWTDecryptOptions.md#keymanagementalgorithms)
- [maxTokenAge](jwt_decrypt.JWTDecryptOptions.md#maxtokenage)
- [subject](jwt_decrypt.JWTDecryptOptions.md#subject)
- [typ](jwt_decrypt.JWTDecryptOptions.md#typ)

## Properties

### audience

• `Optional` **audience**: `string` \| `string`[]

Expected JWT "aud" (Audience) Claim value(s).

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[audience](types.JWTClaimVerificationOptions.md#audience)

#### Defined in

[types.d.ts:486](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L486)

___

### clockTolerance

• `Optional` **clockTolerance**: `string` \| `number`

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[clockTolerance](types.JWTClaimVerificationOptions.md#clocktolerance)

#### Defined in

[types.d.ts:493](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L493)

___

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: `string`[]

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.
By default all "enc" (Encryption Algorithm) values applicable for the used
key/secret are allowed.

#### Inherited from

[DecryptOptions](types.DecryptOptions.md).[contentEncryptionAlgorithms](types.DecryptOptions.md#contentencryptionalgorithms)

#### Defined in

[types.d.ts:459](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L459)

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

[DecryptOptions](types.DecryptOptions.md).[crit](types.DecryptOptions.md#crit)

#### Defined in

[types.d.ts:440](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L440)

___

### currentDate

• `Optional` **currentDate**: `Date`

Date to use when comparing NumericDate claims, defaults to `new Date()`.

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[currentDate](types.JWTClaimVerificationOptions.md#currentdate)

#### Defined in

[types.d.ts:520](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L520)

___

### inflateRaw

• `Optional` **inflateRaw**: [`InflateFunction`](types.InflateFunction.md)

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

#### Inherited from

[DecryptOptions](types.DecryptOptions.md).[inflateRaw](types.DecryptOptions.md#inflateraw)

#### Defined in

[types.d.ts:465](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L465)

___

### issuer

• `Optional` **issuer**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s).

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[issuer](types.JWTClaimVerificationOptions.md#issuer)

#### Defined in

[types.d.ts:498](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L498)

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: `string`[]

A list of accepted JWE "alg" (Algorithm) Header Parameter values.

#### Inherited from

[DecryptOptions](types.DecryptOptions.md).[keyManagementAlgorithms](types.DecryptOptions.md#keymanagementalgorithms)

#### Defined in

[types.d.ts:452](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L452)

___

### maxTokenAge

• `Optional` **maxTokenAge**: `string` \| `number`

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[maxTokenAge](types.JWTClaimVerificationOptions.md#maxtokenage)

#### Defined in

[types.d.ts:505](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L505)

___

### subject

• `Optional` **subject**: `string`

Expected JWT "sub" (Subject) Claim value.

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[subject](types.JWTClaimVerificationOptions.md#subject)

#### Defined in

[types.d.ts:510](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L510)

___

### typ

• `Optional` **typ**: `string`

Expected JWT "typ" (Type) Header Parameter value.

#### Inherited from

[JWTClaimVerificationOptions](types.JWTClaimVerificationOptions.md).[typ](types.JWTClaimVerificationOptions.md#typ)

#### Defined in

[types.d.ts:515](https://github.com/panva/jose/blob/v3.17.0/src/types.d.ts#L515)
