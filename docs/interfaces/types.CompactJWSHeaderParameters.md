# Interface: CompactJWSHeaderParameters

Recognized Compact JWS Header Parameters, any other Header Members
may also be present.

## Table of contents

### Properties

- [alg](types.CompactJWSHeaderParameters.md#alg)
- [b64](types.CompactJWSHeaderParameters.md#b64)
- [crit](types.CompactJWSHeaderParameters.md#crit)
- [cty](types.CompactJWSHeaderParameters.md#cty)
- [jku](types.CompactJWSHeaderParameters.md#jku)
- [jwk](types.CompactJWSHeaderParameters.md#jwk)
- [kid](types.CompactJWSHeaderParameters.md#kid)
- [typ](types.CompactJWSHeaderParameters.md#typ)
- [x5c](types.CompactJWSHeaderParameters.md#x5c)
- [x5t](types.CompactJWSHeaderParameters.md#x5t)
- [x5u](types.CompactJWSHeaderParameters.md#x5u)

## Properties

### alg

• **alg**: `string`

JWS "alg" (Algorithm) Header Parameter.

___

### b64

• `Optional` **b64**: `boolean`

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://www.rfc-editor.org/rfc/rfc7797).

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
