# Interface: CompactJWEHeaderParameters

[💗 Help the project](https://github.com/sponsors/panva)

Recognized Compact JWE Header Parameters, any other Header Members may also be present.

## Table of contents

### Properties

- [alg](types.CompactJWEHeaderParameters.md#alg)
- [enc](types.CompactJWEHeaderParameters.md#enc)
- [crit](types.CompactJWEHeaderParameters.md#crit)
- [cty](types.CompactJWEHeaderParameters.md#cty)
- [jku](types.CompactJWEHeaderParameters.md#jku)
- [jwk](types.CompactJWEHeaderParameters.md#jwk)
- [kid](types.CompactJWEHeaderParameters.md#kid)
- [typ](types.CompactJWEHeaderParameters.md#typ)
- [x5c](types.CompactJWEHeaderParameters.md#x5c)
- [x5t](types.CompactJWEHeaderParameters.md#x5t)
- [x5u](types.CompactJWEHeaderParameters.md#x5u)
- [zip](types.CompactJWEHeaderParameters.md#zip)

## Properties

### alg

• **alg**: `string`

JWE "alg" (Algorithm) Header Parameter.

___

### enc

• **enc**: `string`

JWE "enc" (Encryption Algorithm) Header Parameter.

___

### crit

• `Optional` **crit**: `string`[]

JWE "crit" (Critical) Header Parameter.

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

• `Optional` **jwk**: `Pick`<[`JWK`](types.JWK.md), ``"crv"`` \| ``"e"`` \| ``"kty"`` \| ``"n"`` \| ``"x"`` \| ``"y"``\>

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

JWE "zip" (Compression Algorithm) Header Parameter.
