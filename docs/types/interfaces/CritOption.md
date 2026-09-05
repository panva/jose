# Interface: CritOption

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Shared "crit" option for signing, verification, encryption, and decryption.

## Properties

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
