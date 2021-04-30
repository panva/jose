# Interface: JWTClaimVerificationOptions

[types](../modules/types.md).JWTClaimVerificationOptions

JWT Claims Set verification options.

## Hierarchy

* **JWTClaimVerificationOptions**

  ↳ [*JWTDecryptOptions*](jwt_decrypt.jwtdecryptoptions.md)

  ↳ [*JWTVerifyOptions*](jwt_verify.jwtverifyoptions.md)

## Table of contents

### Properties

- [audience](types.jwtclaimverificationoptions.md#audience)
- [clockTolerance](types.jwtclaimverificationoptions.md#clocktolerance)
- [currentDate](types.jwtclaimverificationoptions.md#currentdate)
- [issuer](types.jwtclaimverificationoptions.md#issuer)
- [maxTokenAge](types.jwtclaimverificationoptions.md#maxtokenage)
- [subject](types.jwtclaimverificationoptions.md#subject)
- [typ](types.jwtclaimverificationoptions.md#typ)

## Properties

### audience

• `Optional` **audience**: *string* \| *string*[]

Expected JWT "aud" (Audience) Claim value(s).

Defined in: [types.d.ts:476](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L476)

___

### clockTolerance

• `Optional` **clockTolerance**: *string* \| *number*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Defined in: [types.d.ts:483](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L483)

___

### currentDate

• `Optional` **currentDate**: Date

Date to use when comparing NumericDate claims, defaults to `new Date()`.

Defined in: [types.d.ts:510](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L510)

___

### issuer

• `Optional` **issuer**: *string* \| *string*[]

Expected JWT "iss" (Issuer) Claim value(s).

Defined in: [types.d.ts:488](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L488)

___

### maxTokenAge

• `Optional` **maxTokenAge**: *string* \| *number*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Defined in: [types.d.ts:495](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L495)

___

### subject

• `Optional` **subject**: *string*

Expected JWT "sub" (Subject) Claim value.

Defined in: [types.d.ts:500](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L500)

___

### typ

• `Optional` **typ**: *string*

Expected JWT "typ" (Type) Header Parameter value.

Defined in: [types.d.ts:505](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L505)
