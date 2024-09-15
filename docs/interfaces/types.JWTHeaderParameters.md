# Interface: JWTHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Recognized Signed JWT Header Parameters, any other Header Members may also be present.

## Table of contents

### Properties

- [alg](types.JWTHeaderParameters.md#alg)
- [b64](types.JWTHeaderParameters.md#b64)
- [crit](types.JWTHeaderParameters.md#crit)
- [cty](types.JWTHeaderParameters.md#cty)
- [jku](types.JWTHeaderParameters.md#jku)
- [jwk](types.JWTHeaderParameters.md#jwk)
- [kid](types.JWTHeaderParameters.md#kid)
- [typ](types.JWTHeaderParameters.md#typ)
- [x5c](types.JWTHeaderParameters.md#x5c)
- [x5t](types.JWTHeaderParameters.md#x5t)
- [x5u](types.JWTHeaderParameters.md#x5u)

## Properties

### alg

• **alg**: `string`

JWS "alg" (Algorithm) Header Parameter

**`See`**

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg)

___

### b64

• `Optional` **b64**: ``true``

This JWS Extension Header Parameter modifies the JWS Payload representation and the JWS Signing
Input computation as per [RFC7797](https://www.rfc-editor.org/rfc/rfc7797).

___

### crit

• `Optional` **crit**: `string`[]

JWS "crit" (Critical) Header Parameter

___

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter

___

### jwk

• `Optional` **jwk**: [`Pick`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys )\<[`JWK`](types.JWK.md), ``"x"`` \| ``"y"`` \| ``"kty"`` \| ``"crv"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter

___

### kid

• `Optional` **kid**: `string`

"kid" (Key ID) Header Parameter

___

### typ

• `Optional` **typ**: `string`

"typ" (Type) Header Parameter

___

### x5c

• `Optional` **x5c**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter

___

### x5t

• `Optional` **x5t**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter

___

### x5u

• `Optional` **x5u**: `string`

"x5u" (X.509 URL) Header Parameter
