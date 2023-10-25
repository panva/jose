# Interface: DecryptOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

JWE Decryption options.

## Table of contents

### Properties

- [contentEncryptionAlgorithms](types.DecryptOptions.md#contentencryptionalgorithms)
- [crit](types.DecryptOptions.md#crit)
- [keyManagementAlgorithms](types.DecryptOptions.md#keymanagementalgorithms)
- [maxPBES2Count](types.DecryptOptions.md#maxpbes2count)

## Properties

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: `string`[]

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values. By default all
"enc" (Encryption Algorithm) values applicable for the used key/secret are allowed.

___

### crit

• `Optional` **crit**: `Object`

An object with keys representing recognized "crit" (Critical) Header Parameter names. The value
for those is either `true` or `false`. `true` when the Header Parameter MUST be integrity
protected, `false` when it's irrelevant.

This makes the "Extension Header Parameter "..." is not recognized" error go away.

Use this when a given JWS/JWT/JWE profile requires the use of proprietary non-registered "crit"
(Critical) Header Parameters. This will only make sure the Header Parameter is syntactically
correct when provided and that it is optionally integrity protected. It will not process the
Header Parameter in any way or reject the operation if it is missing. You MUST still verify the
Header Parameter was present and process it according to the profile's validation steps after
the operation succeeds.

The JWS extension Header Parameter `b64` is always recognized and processed properly. No other
registered Header Parameters that need this kind of default built-in treatment are currently
available.

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: `string`[]

A list of accepted JWE "alg" (Algorithm) Header Parameter values. By default all "alg"
(Algorithm) Header Parameter values applicable for the used key/secret are allowed except for
all PBES2 Key Management Algorithms, these need to be explicitly allowed using this option.

___

### maxPBES2Count

• `Optional` **maxPBES2Count**: `number`

(PBES2 Key Management Algorithms only) Maximum allowed "p2c" (PBES2 Count) Header Parameter
value. The PBKDF2 iteration count defines the algorithm's computational expense. By default
this value is set to 10000.
