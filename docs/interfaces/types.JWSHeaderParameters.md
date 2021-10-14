# Interface: JWSHeaderParameters

Recognized JWS Header Parameters, any other Header Members
may also be present.

## Indexable

▪ [propName: `string`]: `unknown`

Any other JWS Header member.

## Table of contents

### Properties

- [alg](types.JWSHeaderParameters.md#alg)
- [b64](types.JWSHeaderParameters.md#b64)
- [crit](types.JWSHeaderParameters.md#crit)
- [cty](types.JWSHeaderParameters.md#cty)
- [jku](types.JWSHeaderParameters.md#jku)
- [jwk](types.JWSHeaderParameters.md#jwk)
- [kid](types.JWSHeaderParameters.md#kid)
- [typ](types.JWSHeaderParameters.md#typ)
- [x5c](types.JWSHeaderParameters.md#x5c)
- [x5t](types.JWSHeaderParameters.md#x5t)
- [x5u](types.JWSHeaderParameters.md#x5u)

## Properties

### alg

• `Optional` **alg**: `string`

JWS "alg" (Algorithm) Header Parameter.

___

### b64

• `Optional` **b64**: `boolean`

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://tools.ietf.org/html/rfc7797).

___

### crit

• `Optional` **crit**: `string`[]

JWS "crit" (Critical) Header Parameter.

___

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter.

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter.

___

### jwk

• `Optional` **jwk**: `Pick`<[`JWK`](types.JWK.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

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
