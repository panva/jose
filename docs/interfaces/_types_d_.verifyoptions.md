# Interface: VerifyOptions

JWS Verification options.

## Index

### Properties

* [algorithms](_types_d_.verifyoptions.md#algorithms)
* [crit](_types_d_.verifyoptions.md#crit)

## Properties

### algorithms

• `Optional` **algorithms**: string[]

*Defined in [src/types.d.ts:464](https://github.com/panva/jose/blob/v3.5.1/src/types.d.ts#L464)*

A list of accepted JWS "alg" (Algorithm) Header Parameter values.

___

### crit

• `Optional` **crit**: { [propName:string]: boolean;  }

*Defined in [src/types.d.ts:378](https://github.com/panva/jose/blob/v3.5.1/src/types.d.ts#L378)*

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
