# Interface: CritOption

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Shared Interface with a "crit" property for all sign, verify, encrypt and decrypt operations.

## Properties

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
