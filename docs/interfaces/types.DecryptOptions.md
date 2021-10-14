# Interface: DecryptOptions

JWE Decryption options.

## Table of contents

### Properties

- [contentEncryptionAlgorithms](types.DecryptOptions.md#contentencryptionalgorithms)
- [crit](types.DecryptOptions.md#crit)
- [inflateRaw](types.DecryptOptions.md#inflateraw)
- [keyManagementAlgorithms](types.DecryptOptions.md#keymanagementalgorithms)

## Properties

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: `string`[]

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.
By default all "enc" (Encryption Algorithm) values applicable for the used
key/secret are allowed.

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
any way or reject the operation if it is missing. You MUST still
verify the Header Parameter was present and process it according to the
profile's validation steps after the operation succeeds.

The JWS extension Header Parameter `b64` is always recognized and processed
properly. No other registered Header Parameters that need this kind of
default built-in treatment are currently available.

#### Index signature

▪ [propName: `string`]: `boolean`

___

### inflateRaw

• `Optional` **inflateRaw**: [`InflateFunction`](types.InflateFunction.md)

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: `string`[]

A list of accepted JWE "alg" (Algorithm) Header Parameter values.
