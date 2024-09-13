# Interface: JWEHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Recognized JWE Header Parameters, any other Header members may also be present.

## Table of contents

### Properties

- [alg](types.JWEHeaderParameters.md#alg)
- [crit](types.JWEHeaderParameters.md#crit)
- [cty](types.JWEHeaderParameters.md#cty)
- [enc](types.JWEHeaderParameters.md#enc)
- [jku](types.JWEHeaderParameters.md#jku)
- [jwk](types.JWEHeaderParameters.md#jwk)
- [kid](types.JWEHeaderParameters.md#kid)
- [typ](types.JWEHeaderParameters.md#typ)
- [x5c](types.JWEHeaderParameters.md#x5c)
- [x5t](types.JWEHeaderParameters.md#x5t)
- [x5u](types.JWEHeaderParameters.md#x5u)
- [zip](types.JWEHeaderParameters.md#zip)

## Properties

### alg

• `Optional` **alg**: `string`

JWE "alg" (Algorithm) Header Parameter.

___

### crit

• `Optional` **crit**: `string`[]

JWE "crit" (Critical) Header Parameter.

___

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter.

___

### enc

• `Optional` **enc**: `string`

JWE "enc" (Encryption Algorithm) Header Parameter.

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter.

___

### jwk

• `Optional` **jwk**: [`Pick`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys )\<[`JWK`](types.JWK.md), ``"x"`` \| ``"y"`` \| ``"kty"`` \| ``"crv"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

___

### kid

• `Optional` **kid**: `string`

"kid" (Key ID) Header Parameter.

___

### typ

• `Optional` **typ**: `string`

"typ" (Type) Header Parameter.

___

### x5c

• `Optional` **x5c**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter.

___

### x5t

• `Optional` **x5t**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

___

### x5u

• `Optional` **x5u**: `string`

"x5u" (X.509 URL) Header Parameter.

___

### zip

• `Optional` **zip**: `string`

JWE "zip" (Compression Algorithm) Header Parameter. This parameter is not supported anymore.

**`Deprecated`**

Compression of data SHOULD NOT be done before encryption, because such compressed
  data often reveals information about the plaintext.

**`See`**

[Avoid Compression of Encryption Inputs](https://www.rfc-editor.org/rfc/rfc8725#name-avoid-compression-of-encryp)
