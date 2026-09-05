# Interface: DecryptOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JWE Decryption options.

## Properties

### contentEncryptionAlgorithms?

• `optional` **contentEncryptionAlgorithms?**: `string`[]

Accepted JWE "enc" (Encryption Algorithm) Header Parameter values. Defaults to all algorithms
applicable to the key or secret.

***

### crit?

• `optional` **crit?**: `object`

Recognized "crit" (Critical) Header Parameter names. Set each value to `true` to require
integrity protection, or `false` when protection is optional. The JWS `b64` extension is always
recognized and processed.

> [!WARNING]\
> Other extensions are only checked for syntax and optional integrity protection. Their presence
> is not required by this option. You must check their presence and process them according to the
> profile's validation steps after the operation succeeds.

#### Index Signature

\[`propName`: `string`\]: `boolean`

***

### keyManagementAlgorithms?

• `optional` **keyManagementAlgorithms?**: `string`[]

Accepted JWE "alg" (Algorithm) Header Parameter values. Defaults to all algorithms applicable
to the key or secret except PBES2, which must be explicitly allowed.

***

### maxDecompressedLength?

• `optional` **maxDecompressedLength?**: `number`

Maximum decompressed plaintext size in bytes. Defaults to 250000; `0` rejects compressed JWEs,
and `Infinity` disables the limit. Other values must be positive safe integers.

***

### maxPBES2Count?

• `optional` **maxPBES2Count?**: `number`

Maximum "p2c" (PBES2 Count) Header Parameter value, limiting PBKDF2 iterations and their
computational expense. Defaults to 10000; must be a positive safe integer or `Infinity` to
disable the limit.
