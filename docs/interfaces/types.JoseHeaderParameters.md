# Interface: JoseHeaderParameters

[types](../modules/types.md).JoseHeaderParameters

## Hierarchy

- **`JoseHeaderParameters`**

  ↳ [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

  ↳ [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

## Table of contents

### Properties

- [cty](types.JoseHeaderParameters.md#cty)
- [jku](types.JoseHeaderParameters.md#jku)
- [jwk](types.JoseHeaderParameters.md#jwk)
- [kid](types.JoseHeaderParameters.md#kid)
- [typ](types.JoseHeaderParameters.md#typ)
- [x5c](types.JoseHeaderParameters.md#x5c)
- [x5t](types.JoseHeaderParameters.md#x5t)
- [x5u](types.JoseHeaderParameters.md#x5u)

## Properties

### cty

• `Optional` **cty**: `string`

"cty" (Content Type) Header Parameter.

#### Defined in

[types.d.ts:299](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L299)

___

### jku

• `Optional` **jku**: `string`

"jku" (JWK Set URL) Header Parameter.

#### Defined in

[types.d.ts:284](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L284)

___

### jwk

• `Optional` **jwk**: `Pick`<[`JWK`](types.JWK.md), ``"kty"`` \| ``"crv"`` \| ``"x"`` \| ``"y"`` \| ``"e"`` \| ``"n"``\>

"jwk" (JSON Web Key) Header Parameter.

#### Defined in

[types.d.ts:289](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L289)

___

### kid

• `Optional` **kid**: `string`

"kid" (Key ID) Header Parameter.

#### Defined in

[types.d.ts:264](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L264)

___

### typ

• `Optional` **typ**: `string`

"typ" (Type) Header Parameter.

#### Defined in

[types.d.ts:294](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L294)

___

### x5c

• `Optional` **x5c**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter.

#### Defined in

[types.d.ts:274](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L274)

___

### x5t

• `Optional` **x5t**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

#### Defined in

[types.d.ts:269](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L269)

___

### x5u

• `Optional` **x5u**: `string`

"x5u" (X.509 URL) Header Parameter.

#### Defined in

[types.d.ts:279](https://github.com/panva/jose/blob/v3.18.0/src/types.d.ts#L279)
