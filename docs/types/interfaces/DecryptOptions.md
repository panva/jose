# Interface: DecryptOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JWE Decryption options.

## Properties

### contentEncryptionAlgorithms?

• `optional` **contentEncryptionAlgorithms?**: `string`[]

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values. By default all
"enc" (Encryption Algorithm) values applicable for the used key/secret are allowed.

***

### crit?

• `optional` **crit?**: `object`

An object with keys representing recognized "crit" (Critical) Header Parameter names. The value
for those is either `true` or `false`. `true` when the Header Parameter MUST be integrity
protected, `false` when it's irrelevant. The JWS extension Header Parameter `b64` is always
recognized and processed properly; no other registered Header Parameters currently receive this
built-in treatment.

> [!WARNING]\
> This only checks that the Header Parameter is syntactically correct when provided and,
> optionally, integrity protected. It does not process the Header Parameter or reject the
> operation when it is missing. You MUST still verify its presence and process it according to
> the profile's validation steps after the operation succeeds.

#### Index Signature

\[`propName`: `string`\]: `boolean`

***

### keyManagementAlgorithms?

• `optional` **keyManagementAlgorithms?**: `string`[]

A list of accepted JWE "alg" (Algorithm) Header Parameter values. By default all "alg"
(Algorithm) Header Parameter values applicable for the used key/secret are allowed except for
all PBES2 Key Management Algorithms, these need to be explicitly allowed using this option.

***

### maxDecompressedLength?

• `optional` **maxDecompressedLength?**: `number`

Maximum allowed size (in bytes) of the decompressed plaintext when the JWE `"zip"` (Compression
Algorithm) Header Parameter is present. By default this value is set to 250000 (250 KB). The
value must be `0`, a positive safe integer, or `Infinity`. Set it to `0` to reject all
compressed JWEs during decryption or to `Infinity` to disable the decompressed size limit.

***

### maxPBES2Count?

• `optional` **maxPBES2Count?**: `number`

(PBES2 Key Management Algorithms only) Maximum allowed "p2c" (PBES2 Count) Header Parameter
value. The PBKDF2 iteration count defines the algorithm's computational expense. By default
this value is set to 10000.
