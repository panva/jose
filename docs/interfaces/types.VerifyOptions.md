# Interface: VerifyOptions

[types](../modules/types.md).VerifyOptions

JWS Verification options.

## Hierarchy

- [`CritOption`](types.CritOption.md)

  ↳ **`VerifyOptions`**

  ↳↳ [`JWTVerifyOptions`](jwt_verify.JWTVerifyOptions.md)

## Table of contents

### Properties

- [algorithms](types.VerifyOptions.md#algorithms)
- [crit](types.VerifyOptions.md#crit)

## Properties

### algorithms

• `Optional` **algorithms**: `string`[]

A list of accepted JWS "alg" (Algorithm) Header Parameter values.
By default all "alg" (Algorithm) values applicable for the used
key/secret are allowed. Note: "none" is never accepted.

#### Defined in

[types.d.ts:532](https://github.com/panva/jose/blob/v3.16.0/src/types.d.ts#L532)

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

[CritOption](types.CritOption.md).[crit](types.CritOption.md#crit)

#### Defined in

[types.d.ts:440](https://github.com/panva/jose/blob/v3.16.0/src/types.d.ts#L440)
