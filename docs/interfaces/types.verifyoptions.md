# Interface: VerifyOptions

[types](../modules/types.md).VerifyOptions

JWS Verification options.

## Hierarchy

* [*CritOption*](types.critoption.md)

  ↳ **VerifyOptions**

  ↳↳ [*JWTVerifyOptions*](jwt_verify.jwtverifyoptions.md)

## Table of contents

### Properties

- [algorithms](types.verifyoptions.md#algorithms)
- [crit](types.verifyoptions.md#crit)

## Properties

### algorithms

• `Optional` **algorithms**: *string*[]

A list of accepted JWS "alg" (Algorithm) Header Parameter values.
By default all "alg" (Algorithm) values applicable for the used
key/secret are allowed. Note: "none" is never accepted.

Defined in: [types.d.ts:523](https://github.com/panva/jose/blob/v3.11.4/src/types.d.ts#L523)

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

Inherited from: [CritOption](types.critoption.md).[crit](types.critoption.md#crit)

Defined in: [types.d.ts:431](https://github.com/panva/jose/blob/v3.11.4/src/types.d.ts#L431)
